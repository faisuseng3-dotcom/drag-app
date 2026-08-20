import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { colors, spacing, typography } from "@/constants/theme";
import { Button } from "@/components/Button";

export function Hero() {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;

  return (
    <View style={styles.container}>
      <Text style={[styles.headline, { fontSize: isWide ? 56 : 34, lineHeight: isWide ? 62 : 40 }]}>
        Vad ska vi göra ikväll?
      </Text>
      <Text style={styles.subtitle}>Hitta och boka unika upplevelser i Stockholm — med dina vänner.</Text>
      <View style={styles.buttonRow}>
        <Button label="Utforska upplevelser" onPress={() => {}} />
        <Button label="Sista Minuten" variant="outline" onPress={() => router.push("/(tabs)/sista-minuten")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 1.5,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  headline: {
    ...typography.display,
    color: colors.text,
    textAlign: "center",
    maxWidth: 720,
  },
  subtitle: {
    ...typography.body,
    fontSize: 17,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 460,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
