import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { getCategoryById, getExperienceById, getProviderById } from "@/services/experiences";
import { Experience } from "@/types";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { formatDistance, formatDuration, formatPrice } from "@/utils/format";

const { width: SCREEN_W } = Dimensions.get("window");
const HERO_H = SCREEN_W * 1.1;

export default function ExperienceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getExperienceById(id).then((e) => setExperience(e ?? null));
  }, [id]);

  if (experience === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (experience === null) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ color: colors.text }}>Upplevelsen kunde inte hittas.</Text>
      </SafeAreaView>
    );
  }

  const category = getCategoryById(experience.categoryId);
  const provider = getProviderById(experience.providerId);
  const displayPrice = experience.discountedPrice ?? experience.price;

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ height: HERO_H }}>
          <LinearGradient colors={experience.gradient} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.55)"]} style={StyleSheet.absoluteFill} />
          <SafeAreaView style={styles.heroTopBar} edges={["top"]}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color={colors.onDark} />
            </Pressable>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable style={styles.iconButton}>
                <Ionicons name="bookmark-outline" size={20} color={colors.onDark} />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="share-outline" size={20} color={colors.onDark} />
              </Pressable>
            </View>
          </SafeAreaView>

          <View style={styles.heroBottom}>
            {experience.isLastMinute ? <Badge label="SISTA MINUTEN" color={colors.success} /> : null}
            <Text style={styles.heroTitle}>{experience.title}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.providerRow}>
            <View style={styles.providerAvatar}>
              <Ionicons name="storefront-outline" size={20} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={styles.providerName}>{provider?.companyName}</Text>
                {provider?.verified ? (
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                ) : null}
              </View>
              <Text style={styles.providerMeta}>
                ⭐ {provider?.rating.toFixed(1)} ({provider?.totalReviews} recensioner)
              </Text>
            </View>
            <Pressable style={styles.followButton}>
              <Text style={styles.followButtonText}>Följ</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <StatBlock icon="time-outline" label={formatDuration(experience.durationMinutes)} />
            <StatBlock
              icon="people-outline"
              label={`${experience.minParticipants}–${experience.maxParticipants} pers`}
            />
            <StatBlock icon="location-outline" label={formatDistance(experience.distanceKm) || experience.location} />
          </View>

          <View style={styles.urgencyRow}>
            <Ionicons name="flame-outline" size={16} color={colors.warning} />
            <Text style={styles.urgencyText}>{experience.availableSpots} platser kvar</Text>
            {category ? <Badge label={category.name} color={category.color} style={{ marginLeft: "auto" }} /> : null}
          </View>

          <Section title="Vad ni ska göra">
            <Text style={styles.paragraph}>{experience.whatYoullDo}</Text>
          </Section>

          <Section title="Vad som ingår">
            {experience.whatsIncluded.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <Ionicons name="checkmark" size={16} color={colors.success} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>

          <Section title="Bra att veta">
            {experience.goodToKnow.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>

          <Section title="Plats">
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={28} color={colors.textFaint} />
              <Text style={styles.mapAddress}>{experience.address}</Text>
            </View>
          </Section>

          <Pressable
            style={styles.inviteRow}
            onPress={() => router.push(`/group/new?experienceId=${experience.id}`)}
          >
            <Ionicons name="people" size={20} color={colors.accent} />
            <Text style={styles.inviteText}>Bjud in vänner till denna upplevelse</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: "auto" }} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.stickyBar}>
        <View>
          {experience.discountedPrice ? (
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
              <Text style={styles.stickyOriginal}>{formatPrice(experience.price)}</Text>
              <Text style={styles.stickyPrice}>{formatPrice(displayPrice)}</Text>
            </View>
          ) : (
            <Text style={styles.stickyPrice}>{formatPrice(displayPrice)}</Text>
          )}
          <Text style={styles.stickyPerPerson}>per person</Text>
        </View>
        <Button
          label="Boka nu"
          style={{ flex: 1, marginLeft: spacing.lg }}
          onPress={() => router.push(`/booking/${experience.id}`)}
        />
      </View>
    </View>
  );
}

function StatBlock({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string }) {
  return (
    <View style={styles.statBlock}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  heroTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBottom: {
    position: "absolute",
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
  heroTitle: {
    ...typography.hero,
    fontSize: 30,
    color: colors.onDark,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  providerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  providerMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  followButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  followButtonText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statBlock: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text,
  },
  urgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.lg,
  },
  urgencyText: {
    ...typography.bodyBold,
    color: colors.warning,
  },
  section: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
    color: colors.text,
  },
  paragraph: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  bulletText: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  mapPlaceholder: {
    height: 140,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  mapAddress: {
    ...typography.caption,
    color: colors.textMuted,
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  inviteText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  stickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stickyPrice: {
    ...typography.title,
    color: colors.text,
  },
  stickyOriginal: {
    ...typography.caption,
    color: colors.textFaint,
    textDecorationLine: "line-through",
  },
  stickyPerPerson: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
