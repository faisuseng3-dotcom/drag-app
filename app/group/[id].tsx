import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { Button } from "@/components/Button";
import { GroupEvent, Experience } from "@/types";
import {
  ME_ID,
  getCostSplit,
  getGroupEventById,
  hasMemberVoted,
  simulateFriendVotes,
  voteDate,
  voteExperience,
  votesForDate,
  votesForExperience,
} from "@/services/groupEvents";
import { getExperienceById } from "@/services/experiences";
import { getFriendById, initialsFor } from "@/data/friends";
import { formatPrice } from "@/utils/format";

export default function GroupEventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<GroupEvent | null | undefined>(undefined);
  const [experienceMap, setExperienceMap] = useState<Record<string, Experience>>({});
  const [simulating, setSimulating] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    getGroupEventById(id).then(async (e) => {
      setEvent(e ?? null);
      if (e) {
        const entries = await Promise.all(e.experienceIds.map(async (expId) => [expId, await getExperienceById(expId)] as const));
        const map: Record<string, Experience> = {};
        for (const [expId, exp] of entries) if (exp) map[expId] = exp;
        setExperienceMap(map);
      }
    });
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (event === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.text} size="large" />
      </View>
    );
  }

  if (event === null) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ color: colors.text }}>Eventet kunde inte hittas.</Text>
      </SafeAreaView>
    );
  }

  const allMemberIds = [event.organizerId, ...event.memberIds];
  const myVote = event.votes.find((v) => v.userId === ME_ID)?.experienceId;
  const myDateVote = event.dateVotes.find((v) => v.userId === ME_ID)?.date;

  async function handleVoteExperience(experienceId: string) {
    if (!event) return;
    const updated = await voteExperience(event.id, ME_ID, experienceId);
    if (updated) setEvent({ ...updated });
  }

  async function handleVoteDate(date: string) {
    if (!event) return;
    const updated = await voteDate(event.id, ME_ID, date);
    if (updated) setEvent({ ...updated });
  }

  async function handleSimulate() {
    if (!event) return;
    setSimulating(true);
    const updated = await simulateFriendVotes(event.id);
    setSimulating(false);
    if (updated) setEvent({ ...updated });
  }

  function handleBookForGroup() {
    if (!event || !event.finalExperienceId) return;
    const costSplit = getCostSplit(event);
    router.push(
      `/booking/${event.finalExperienceId}?groupEventId=${event.id}&people=${costSplit?.people ?? allMemberIds.length}&dateLabel=${encodeURIComponent(event.finalDate ?? "")}`
    );
  }

  const resultReady = event.status === "resulted" || event.status === "booked";
  const winningExperience = event.finalExperienceId ? experienceMap[event.finalExperienceId] : undefined;
  const costSplit = getCostSplit(event);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.membersRow}>
          {allMemberIds.map((memberId) => {
            const voted = hasMemberVoted(event, memberId);
            const isMe = memberId === ME_ID;
            const friend = isMe ? undefined : getFriendById(memberId);
            const name = isMe ? "Du" : (friend?.name.split(" ")[0] ?? "?");
            const color = isMe ? colors.accent : (friend?.color ?? colors.textFaint);
            return (
              <View key={memberId} style={styles.memberItem}>
                <View style={[styles.memberAvatar, { backgroundColor: color }]}>
                  <Text style={styles.memberAvatarText}>{isMe ? "DU" : initialsFor(friend?.name ?? "?")}</Text>
                  {voted ? (
                    <View style={styles.votedBadge}>
                      <Ionicons name="checkmark" size={10} color={colors.onDark} />
                    </View>
                  ) : null}
                </View>
                <Text style={styles.memberName} numberOfLines={1}>
                  {name}
                </Text>
              </View>
            );
          })}
        </View>

        {resultReady && winningExperience ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultKicker}>🎉 Gruppen valde</Text>
            <View style={styles.resultImageWrap}>
              <LinearGradient colors={winningExperience.gradient} style={StyleSheet.absoluteFill} />
            </View>
            <Text style={styles.resultTitle}>{winningExperience.title}</Text>
            <Text style={styles.resultDate}>{event.finalDate}</Text>

            {costSplit ? (
              <View style={styles.splitRow}>
                <Text style={styles.splitText}>
                  {formatPrice(costSplit.perPerson)} per person · {costSplit.people} personer
                </Text>
                <Text style={styles.splitTotal}>Totalt {formatPrice(costSplit.total)}</Text>
              </View>
            ) : null}

            {event.status === "booked" ? (
              <View style={styles.bookedNotice}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.bookedText}>Bokat! Övriga medlemmar har fått en Swish-länk för att betala sin del.</Text>
              </View>
            ) : (
              <>
                <Button label="Boka för hela gruppen" onPress={handleBookForGroup} />
                <Text style={styles.footnote}>
                  Du bokar och betalar hela beloppet nu. Övriga medlemmar betalar tillbaka sin del via Swish.
                </Text>
              </>
            )}
          </View>
        ) : (
          <>
            <Section title="Rösta på upplevelse">
              <View style={{ gap: spacing.sm }}>
                {event.experienceIds.map((expId) => {
                  const exp = experienceMap[expId];
                  if (!exp) return null;
                  const active = myVote === expId;
                  const count = votesForExperience(event, expId);
                  return (
                    <Pressable
                      key={expId}
                      onPress={() => handleVoteExperience(expId)}
                      style={[styles.voteRow, active && styles.voteRowActive]}
                    >
                      <View style={[styles.voteSwatch, { backgroundColor: exp.gradient[1] }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.voteTitle} numberOfLines={1}>
                          {exp.title}
                        </Text>
                        <Text style={styles.voteMeta}>
                          {formatPrice(exp.discountedPrice ?? exp.price)} · {count} {count === 1 ? "röst" : "röster"}
                        </Text>
                      </View>
                      <Ionicons
                        name={active ? "checkmark-circle" : "ellipse-outline"}
                        size={22}
                        color={active ? colors.text : colors.textFaint}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            <Section title="Rösta på datum">
              <View style={styles.chipWrap}>
                {event.proposedDates.map((date) => {
                  const active = myDateVote === date;
                  const count = votesForDate(event, date);
                  return (
                    <Pressable
                      key={date}
                      onPress={() => handleVoteDate(date)}
                      style={[styles.dateChip, active && styles.dateChipActive]}
                    >
                      <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>
                        {date}
                        {count > 0 ? ` · ${count}` : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            <View style={styles.simulateBox}>
              <Text style={styles.simulateLabel}>Väntar på svar från {event.memberIds.length} vänner</Text>
              <Button
                label="Simulera vänners röster"
                variant="secondary"
                loading={simulating}
                onPress={handleSimulate}
              />
              <Text style={styles.footnote}>
                Demo-läge: eftersom appen inte har riktiga inloggade vänner än kan du simulera deras röster här.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  membersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  memberItem: {
    alignItems: "center",
    width: 56,
    gap: 4,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: {
    ...typography.micro,
    fontSize: 10,
    color: colors.onDark,
  },
  votedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  memberName: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 16,
    color: colors.text,
  },
  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  voteRowActive: {
    borderColor: colors.text,
  },
  voteSwatch: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
  },
  voteTitle: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  voteMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dateChip: {
    paddingHorizontal: spacing.lg,
    height: 40,
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dateChipText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  dateChipTextActive: {
    color: colors.onDark,
  },
  simulateBox: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simulateLabel: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  footnote: {
    ...typography.caption,
    color: colors.textFaint,
  },
  resultCard: {
    gap: spacing.sm,
  },
  resultKicker: {
    ...typography.title,
    fontSize: 18,
    color: colors.text,
  },
  resultImageWrap: {
    height: 160,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  resultTitle: {
    ...typography.hero,
    fontSize: 22,
    color: colors.text,
  },
  resultDate: {
    ...typography.body,
    color: colors.textMuted,
  },
  splitRow: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: 4,
  },
  splitText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  splitTotal: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bookedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  bookedText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
});
