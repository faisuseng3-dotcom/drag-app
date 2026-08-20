import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { GroupEvent } from "@/types";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { getExperienceById } from "@/services/experiences";
import { getFriendById, initialsFor } from "@/data/friends";
import { useEffect, useState } from "react";

const STATUS_LABEL: Record<GroupEvent["status"], string> = {
  voting: "Röstning pågår",
  resulted: "Resultat klart",
  booked: "Bokat",
};

export function GroupEventCard({ event }: { event: GroupEvent }) {
  const [coverGradient, setCoverGradient] = useState<[string, string]>([colors.surface, colors.surface]);

  useEffect(() => {
    const firstId = event.experienceIds[0];
    if (!firstId) return;
    getExperienceById(firstId).then((exp) => {
      if (exp) setCoverGradient(exp.gradient);
    });
  }, [event.experienceIds]);

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/group/${event.id}`)}>
      <View style={styles.cover}>
        <LinearGradient colors={coverGradient} style={StyleSheet.absoluteFill} />
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{STATUS_LABEL[event.status]}</Text>
        </View>
      </View>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.metaRow}>
        <View style={styles.avatarRow}>
          {event.memberIds.slice(0, 4).map((id) => {
            const friend = getFriendById(id);
            if (!friend) return null;
            return (
              <View key={id} style={[styles.avatar, { backgroundColor: friend.color }]}>
                <Text style={styles.avatarText}>{initialsFor(friend.name)}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.metaText}>
          {event.memberIds.length + 1} personer · {event.experienceIds.length} förslag
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
  },
  cover: {
    height: 140,
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  statusPill: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    backgroundColor: "rgba(26,26,26,0.85)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  statusText: {
    ...typography.micro,
    color: colors.onDark,
  },
  title: {
    ...typography.title,
    fontSize: 18,
    color: colors.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarRow: {
    flexDirection: "row",
    paddingLeft: 8,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarText: {
    ...typography.micro,
    fontSize: 9,
    color: colors.onDark,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
