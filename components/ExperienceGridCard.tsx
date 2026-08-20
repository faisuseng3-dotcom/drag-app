import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Experience } from "@/types";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { getProviderById } from "@/services/experiences";
import { formatPrice } from "@/utils/format";

export function ExperienceGridCard({ experience }: { experience: Experience }) {
  const provider = getProviderById(experience.providerId);
  const displayPrice = experience.discountedPrice ?? experience.price;

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/experience/${experience.id}`)}>
      <View style={styles.imageWrap}>
        <LinearGradient
          colors={experience.gradient}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {experience.isLastMinute ? (
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>SISTA MINUTEN</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.providerRow}>
        <View style={styles.avatar}>
          <Ionicons name="storefront-outline" size={13} color={colors.textMuted} />
        </View>
        <Text style={styles.providerName} numberOfLines={1}>
          {provider?.companyName}
        </Text>
      </View>

      <Text style={styles.location}>{experience.location}, Stockholm</Text>
      <Text style={styles.title} numberOfLines={2}>
        {experience.title}
      </Text>

      <View style={styles.priceRow}>
        {experience.discountedPrice ? (
          <>
            <Text style={styles.strikePrice}>{formatPrice(experience.price)}</Text>
            <Text style={styles.price}>{formatPrice(displayPrice)}</Text>
          </>
        ) : (
          <Text style={styles.price}>{formatPrice(displayPrice)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  imageWrap: {
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  dealBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: "rgba(26,26,26,0.85)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  dealBadgeText: {
    ...typography.micro,
    color: colors.onDark,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  providerName: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
  location: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textFaint,
    marginBottom: 4,
  },
  title: {
    ...typography.title,
    fontSize: 16,
    color: colors.text,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    ...typography.bodyBold,
    color: colors.text,
  },
  strikePrice: {
    ...typography.caption,
    color: colors.textFaint,
    textDecorationLine: "line-through",
  },
});
