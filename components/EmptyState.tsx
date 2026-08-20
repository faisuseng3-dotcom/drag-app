import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/constants/theme";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textFaint} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
