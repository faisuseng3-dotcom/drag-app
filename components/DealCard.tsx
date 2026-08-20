import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Experience } from "@/types";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { getProviderById } from "@/services/experiences";
import { formatCountdown, formatPrice } from "@/utils/format";
import { useNow } from "@/hooks/useNow";

export function DealCard({ experience }: { experience: Experience }) {
  const provider = getProviderById(experience.providerId);
  const now = useNow();
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/experience/${experience.id}`)}>
      <View style={styles.imageWrap}>
        <LinearGradient colors={experience.gradient} style={StyleSheet.absoluteFill} />
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SISTA MINUTEN</Text>
          </View>
          {experience.lastMinuteEndsAt ? (
            <View style={styles.countdownPill}>
              <Text style={styles.countdownText}>{formatCountdown(experience.lastMinuteEndsAt, now)}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.provider}>{provider?.companyName}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {experience.title}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.originalPrice}>{formatPrice(experience.price)}</Text>
        <Text style={styles.price}>{formatPrice(experience.discountedPrice ?? experience.price)}</Text>
        <Text style={styles.spots}>· {experience.availableSpots} platser kvar</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
  },
  imageWrap: {
    height: 180,
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  badgeRow: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  badgeText: {
    ...typography.micro,
    color: colors.onDark,
  },
  countdownPill: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  countdownText: {
    ...typography.micro,
    color: colors.warning,
  },
  provider: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  title: {
    ...typography.title,
    fontSize: 17,
    color: colors.text,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  originalPrice: {
    ...typography.caption,
    color: colors.textFaint,
    textDecorationLine: "line-through",
  },
  price: {
    ...typography.bodyBold,
    color: colors.text,
  },
  spots: {
    ...typography.caption,
    color: colors.warning,
  },
});
