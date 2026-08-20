import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, typography } from "@/constants/theme";
import { getLastMinuteExperiences } from "@/services/experiences";
import { Experience } from "@/types";
import { DealCard } from "@/components/DealCard";
import { EmptyState } from "@/components/EmptyState";

export default function SistaMinutenScreen() {
  const [deals, setDeals] = useState<Experience[] | null>(null);

  useEffect(() => {
    getLastMinuteExperiences().then(setDeals);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Sista Minuten</Text>
        <Text style={styles.subtitle}>Rabatterade upplevelser med lediga platser idag</Text>
      </View>
      {!deals ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
      ) : deals.length === 0 ? (
        <EmptyState icon="flash-outline" title="Inga sista-minuten-erbjudanden just nu" subtitle="Kolla igen senare idag." />
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DealCard experience={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
