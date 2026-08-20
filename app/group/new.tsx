import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { Button } from "@/components/Button";
import { friends, initialsFor } from "@/data/friends";
import { experiences } from "@/data/experiences";
import { PROPOSED_DATE_OPTIONS } from "@/types";
import { createGroupEvent } from "@/services/groupEvents";
import { formatPrice } from "@/utils/format";

const MAX_EXPERIENCES = 3;
const MAX_DATES = 3;

export default function NewGroupEventScreen() {
  const { experienceId } = useLocalSearchParams<{ experienceId?: string }>();
  const [title, setTitle] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [experienceQuery, setExperienceQuery] = useState("");
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(experienceId ? [experienceId] : []);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const filteredExperiences = useMemo(() => {
    const q = experienceQuery.trim().toLowerCase();
    if (!q) return experiences.slice(0, 8);
    return experiences.filter((e) => e.title.toLowerCase().includes(q)).slice(0, 8);
  }, [experienceQuery]);

  function toggleFriend(id: string) {
    setSelectedFriends((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function toggleExperience(id: string) {
    setSelectedExperiences((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id);
      if (prev.length >= MAX_EXPERIENCES) return prev;
      return [...prev, id];
    });
  }

  function toggleDate(date: string) {
    setSelectedDates((prev) => {
      if (prev.includes(date)) return prev.filter((d) => d !== date);
      if (prev.length >= MAX_DATES) return prev;
      return [...prev, date];
    });
  }

  const canSubmit =
    title.trim().length > 0 && selectedFriends.length > 0 && selectedExperiences.length > 0 && selectedDates.length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    const event = createGroupEvent({
      title: title.trim(),
      memberIds: selectedFriends,
      experienceIds: selectedExperiences,
      proposedDates: selectedDates,
    });
    router.replace(`/group/${event.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Skapa en grupp</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Section title="Namn på eventet">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="t.ex. Saras födelsedag 🎉"
            placeholderTextColor={colors.textFaint}
            style={styles.textInput}
          />
        </Section>

        <Section title={`Bjud in vänner${selectedFriends.length ? ` (${selectedFriends.length} valda)` : ""}`}>
          <View style={styles.chipWrap}>
            {friends.map((f) => {
              const active = selectedFriends.includes(f.id);
              return (
                <Pressable
                  key={f.id}
                  onPress={() => toggleFriend(f.id)}
                  style={[styles.friendChip, active && styles.friendChipActive]}
                >
                  <View style={[styles.friendAvatar, { backgroundColor: f.color }]}>
                    <Text style={styles.friendAvatarText}>{initialsFor(f.name)}</Text>
                  </View>
                  <Text style={[styles.friendName, active && styles.friendNameActive]}>{f.name.split(" ")[0]}</Text>
                  {active ? <Ionicons name="checkmark-circle" size={16} color={colors.text} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={`Föreslå upplevelser (max ${MAX_EXPERIENCES})`}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={15} color={colors.textMuted} />
            <TextInput
              value={experienceQuery}
              onChangeText={setExperienceQuery}
              placeholder="Sök upplevelser..."
              placeholderTextColor={colors.textFaint}
              style={styles.searchInput}
            />
          </View>
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            {filteredExperiences.map((exp) => {
              const active = selectedExperiences.includes(exp.id);
              const disabled = !active && selectedExperiences.length >= MAX_EXPERIENCES;
              return (
                <Pressable
                  key={exp.id}
                  onPress={() => toggleExperience(exp.id)}
                  style={[styles.experienceRow, active && styles.experienceRowActive, disabled && { opacity: 0.4 }]}
                  disabled={disabled}
                >
                  <View style={[styles.experienceSwatch, { backgroundColor: exp.gradient[1] }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.experienceTitle} numberOfLines={1}>
                      {exp.title}
                    </Text>
                    <Text style={styles.experiencePrice}>{formatPrice(exp.discountedPrice ?? exp.price)}</Text>
                  </View>
                  {active ? <Ionicons name="checkmark-circle" size={20} color={colors.text} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={`Föreslå datum (max ${MAX_DATES})`}>
          <View style={styles.chipWrap}>
            {PROPOSED_DATE_OPTIONS.map((date) => {
              const active = selectedDates.includes(date);
              const disabled = !active && selectedDates.length >= MAX_DATES;
              return (
                <Pressable
                  key={date}
                  onPress={() => toggleDate(date)}
                  disabled={disabled}
                  style={[styles.dateChip, active && styles.dateChipActive, disabled && { opacity: 0.4 }]}
                >
                  <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{date}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Skicka inbjudningar" onPress={handleSubmit} disabled={!canSubmit} />
      </View>
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
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 16,
    color: colors.text,
  },
  textInput: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 50,
    paddingHorizontal: spacing.md,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  friendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  friendChipActive: {
    borderColor: colors.text,
    backgroundColor: colors.surfaceElevated,
  },
  friendAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  friendAvatarText: {
    ...typography.micro,
    fontSize: 9,
    color: colors.onDark,
  },
  friendName: {
    ...typography.caption,
    color: colors.textMuted,
  },
  friendNameActive: {
    color: colors.text,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 42,
  },
  searchInput: {
    ...typography.body,
    fontSize: 14,
    color: colors.text,
    flex: 1,
    outlineStyle: "none" as any,
  },
  experienceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  experienceRowActive: {
    borderColor: colors.text,
  },
  experienceSwatch: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
  },
  experienceTitle: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  experiencePrice: {
    ...typography.caption,
    color: colors.textMuted,
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
