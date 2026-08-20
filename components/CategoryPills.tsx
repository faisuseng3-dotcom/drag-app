import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

export const PILL_FILTERS = [
  "För dig",
  "Idag",
  "Paintball",
  "Matlagning",
  "Konst",
  "Äventyr",
  "Musik",
  "Dans",
  "Välmående",
] as const;

export type PillFilter = (typeof PILL_FILTERS)[number];

type Props = {
  active: PillFilter;
  onChange: (filter: PillFilter) => void;
};

export function CategoryPills({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {PILL_FILTERS.map((label) => {
        const isActive = label === active;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(label)}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    height: 38,
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    ...typography.bodyBold,
    fontSize: 13.5,
    color: colors.textMuted,
  },
  pillTextActive: {
    color: colors.onDark,
  },
});
