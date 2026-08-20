import { Pressable, StyleSheet, Text, ViewStyle, ActivityIndicator } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = "primary", loading, disabled, style }: Props) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: colors.accent },
        isSecondary && { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border },
        isOutline && { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.text },
        variant === "ghost" && { backgroundColor: "transparent" },
        pressed && { opacity: 0.8 },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onDark : colors.text} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && { color: colors.onDark },
            (isSecondary || isOutline) && { color: colors.text },
            variant === "ghost" && { color: colors.text },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  label: {
    ...typography.bodyBold,
    fontSize: 15,
  },
});
