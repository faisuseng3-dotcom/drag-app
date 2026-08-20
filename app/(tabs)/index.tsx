import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, typography } from "@/constants/theme";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryPills, PillFilter } from "@/components/CategoryPills";
import { ExperienceGridCard } from "@/components/ExperienceGridCard";
import { getExperiences, getCategoryById } from "@/services/experiences";
import { Experience } from "@/types";

function matchesQuery(experience: Experience, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const category = getCategoryById(experience.categoryId);
  return (
    experience.title.toLowerCase().includes(q) ||
    experience.description.toLowerCase().includes(q) ||
    experience.location.toLowerCase().includes(q) ||
    (category?.name.toLowerCase().includes(q) ?? false)
  );
}

const PILL_TO_CATEGORY_IDS: Partial<Record<PillFilter, string[]>> = {
  Paintball: ["paintball"],
  Matlagning: ["mat", "sushi", "brygga", "kaffe"],
  Konst: ["keramik", "foto", "graffiti"],
  Äventyr: ["klattring", "paddling", "trampolin"],
  Musik: ["dj", "standup"],
  Dans: [],
  Välmående: ["bastu"],
};

export default function HomeScreen() {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [filter, setFilter] = useState<PillFilter>("För dig");
  const [query, setQuery] = useState("");
  const { width } = useWindowDimensions();

  useEffect(() => {
    getExperiences().then(setExperiences);
  }, []);

  const columns = width >= 1080 ? 3 : width >= 700 ? 2 : 1;

  const filtered = useMemo(() => {
    if (!experiences) return [];
    let result = experiences;
    if (filter === "Idag") {
      result = result.filter((e) => e.isLastMinute);
    } else if (filter !== "För dig") {
      const ids = PILL_TO_CATEGORY_IDS[filter] ?? [];
      result = result.filter((e) => ids.includes(e.categoryId));
    }
    return result.filter((e) => matchesQuery(e, query));
  }, [experiences, filter, query]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        key={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: spacing.lg } : undefined}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: spacing.xl }}>
            <ExperienceGridCard experience={item} />
          </View>
        )}
        ListHeaderComponent={
          <View style={{ marginHorizontal: -spacing.xl }}>
            <Header searchValue={query} onSearchChange={setQuery} />
            <Hero />
            <CategoryPills active={filter} onChange={setFilter} />
            <Text style={[styles.sectionTitle, { marginHorizontal: spacing.xl }]}>Upplevelser att upptäcka</Text>
          </View>
        }
        ListEmptyComponent={
          experiences ? (
            <Text style={styles.emptyText}>Inga upplevelser i denna kategori ännu.</Text>
          ) : (
            <ActivityIndicator color={colors.text} style={{ marginTop: spacing.xl }} />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.hero,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
