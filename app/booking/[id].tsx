import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { getExperienceById, getProviderById } from "@/services/experiences";
import { markBooked } from "@/services/groupEvents";
import { Experience } from "@/types";
import { Button } from "@/components/Button";
import { formatPrice } from "@/utils/format";

const BASE_DATES = ["Idag", "Imorgon", "Lör 22 aug", "Sön 23 aug", "Mån 24 aug"];
const TIMES = ["17:00", "18:30", "19:00", "20:30"];

export default function BookingScreen() {
  const { id, groupEventId, people: peopleParam, dateLabel } = useLocalSearchParams<{
    id: string;
    groupEventId?: string;
    people?: string;
    dateLabel?: string;
  }>();
  const [experience, setExperience] = useState<Experience | null | undefined>(undefined);
  const [step, setStep] = useState(0);

  const DATES = useMemo(() => {
    if (dateLabel && !BASE_DATES.includes(dateLabel)) return [dateLabel, ...BASE_DATES];
    return BASE_DATES;
  }, [dateLabel]);

  const [dateIdx, setDateIdx] = useState(() => {
    const idx = dateLabel ? DATES.indexOf(dateLabel) : -1;
    return idx >= 0 ? idx : 0;
  });
  const [timeIdx, setTimeIdx] = useState(1);
  const [people, setPeople] = useState(() => {
    const parsed = peopleParam ? parseInt(peopleParam, 10) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
  });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!id) return;
    getExperienceById(id).then((e) => setExperience(e ?? null));
  }, [id]);

  if (!experience) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const provider = getProviderById(experience.providerId);
  const unitPrice = experience.discountedPrice ?? experience.price;
  const total = unitPrice * people;

  async function handlePay() {
    if (groupEventId) await markBooked(groupEventId);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.confirmWrap}>
          <View style={styles.confirmIcon}>
            <Ionicons name="checkmark" size={40} color={colors.text} />
          </View>
          <Text style={styles.confirmTitle}>Bokning bekräftad! 🎉</Text>
          <Text style={styles.confirmSubtitle}>
            {experience.title} · {DATES[dateIdx]} {TIMES[timeIdx]}
          </Text>
          {groupEventId ? (
            <Text style={styles.confirmSubtitle}>
              Övriga {people - 1} medlemmar får en Swish-länk för att betala sin del.
            </Text>
          ) : null}
          <View style={styles.confirmActions}>
            <Button label="Lägg till i kalender" variant="secondary" onPress={() => {}} />
            {!groupEventId ? (
              <Button label="Bjud in vänner" variant="secondary" onPress={() => router.push("/group/new")} />
            ) : null}
            <Button
              label="Klar"
              onPress={() => (groupEventId ? router.replace(`/group/${groupEventId}`) : router.replace("/(tabs)"))}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => (step === 0 ? router.back() : setStep(step - 1))} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Boka {step + 1}/3</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {step === 0 && (
          <>
            <Text style={styles.sectionTitle}>Välj datum</Text>
            <View style={styles.chipWrap}>
              {DATES.map((d, i) => (
                <Pressable key={d} style={[styles.chip, i === dateIdx && styles.chipActive]} onPress={() => setDateIdx(i)}>
                  <Text style={[styles.chipText, i === dateIdx && styles.chipTextActive]}>{d}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Välj tid</Text>
            <View style={styles.chipWrap}>
              {TIMES.map((t, i) => (
                <Pressable key={t} style={[styles.chip, i === timeIdx && styles.chipActive]} onPress={() => setTimeIdx(i)}>
                  <Text style={[styles.chipText, i === timeIdx && styles.chipTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Antal personer</Text>
            <View style={styles.stepperRow}>
              <Pressable
                style={styles.stepperButton}
                onPress={() => setPeople((p) => Math.max(experience.minParticipants, p - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <Text style={styles.stepperValue}>{people}</Text>
              <Pressable
                style={styles.stepperButton}
                onPress={() => setPeople((p) => Math.min(experience.maxParticipants, p + 1))}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Granska bokning</Text>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>{experience.title}</Text>
              <Text style={styles.reviewMeta}>{provider?.companyName}</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Datum</Text>
                <Text style={styles.reviewValue}>{DATES[dateIdx]}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Tid</Text>
                <Text style={styles.reviewValue}>{TIMES[timeIdx]}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Personer</Text>
                <Text style={styles.reviewValue}>{people}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Pris per person</Text>
                <Text style={styles.reviewValue}>{formatPrice(unitPrice)}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewTotalLabel}>Totalt</Text>
                <Text style={styles.reviewTotalValue}>{formatPrice(total)}</Text>
              </View>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Betalning</Text>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewMeta}>
                Betalning hanteras säkert via Stripe. Inga kortuppgifter lagras av DRAG.
              </Text>
              <View style={styles.divider} />
              <View style={styles.reviewRow}>
                <Text style={styles.reviewTotalLabel}>Att betala</Text>
                <Text style={styles.reviewTotalValue}>{formatPrice(total)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={step < 2 ? "Fortsätt" : `Betala ${formatPrice(total)}`}
          onPress={() => (step < 2 ? setStep(step + 1) : handlePay())}
        />
      </View>
    </SafeAreaView>
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
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
    color: colors.text,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chipTextActive: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.onDark,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    ...typography.title,
    color: colors.text,
    minWidth: 30,
    textAlign: "center",
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  reviewTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 17,
  },
  reviewMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  reviewLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  reviewValue: {
    ...typography.body,
    color: colors.text,
  },
  reviewTotalLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  reviewTotalValue: {
    ...typography.title,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  confirmIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  confirmTitle: {
    ...typography.hero,
    color: colors.text,
    textAlign: "center",
  },
  confirmSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  confirmActions: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
