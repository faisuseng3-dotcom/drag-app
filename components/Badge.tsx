import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  label: string;
  color?: string;
  variant?: "solid" | "outline" | "dark";
  style?: ViewStyle;
};

export function Badge({ label, color = colors.accent, variant = "solid", style }: Props) {
  if (variant === "outline") {
    return (
      <View style={[styles.base, { borderWidth: 1, borderColor: color }, style]}>
        <Text style={[styles.text, { color }]}>{label}</Text>
      </View>
    );
  }
  if (variant === "dark") {
    return (
      <View style={[styles.base, { backgroundColor: "rgba(0,0,0,0.55)" }, style]}>
        <Text style={[styles.text, { color: colors.onDark }]}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.base, { backgroundColor: color }, style]}>
      <Text style={[styles.text, { color: colors.onDark }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.micro,
    textTransform: "uppercase",
  },
});
