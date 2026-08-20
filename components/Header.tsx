import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing, typography } from "@/constants/theme";

const NAV_LINKS = ["Utforska", "Kategorier", "Sista Minuten"];

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function Header({ searchValue, onSearchChange }: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.logo}>Drag</Text>

        {isWide ? (
          <View style={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <Pressable key={link} hitSlop={8}>
                <Text style={styles.navLink}>{link}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={styles.right}>
          {isWide ? (
            <View style={styles.searchBar}>
              <Ionicons name="search" size={15} color={colors.textMuted} />
              <TextInput
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder="Sök upplevelser..."
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
              {searchValue.length > 0 ? (
                <Pressable onPress={() => onSearchChange("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={16} color={colors.textFaint} />
                </Pressable>
              ) : null}
            </View>
          ) : (
            <Pressable hitSlop={8} style={styles.iconOnly} onPress={() => setMobileSearchOpen((v) => !v)}>
              <Ionicons name={mobileSearchOpen ? "close" : "search"} size={20} color={colors.text} />
            </Pressable>
          )}
          <Pressable style={styles.signInButton}>
            <Text style={styles.signInText}>Logga in</Text>
          </Pressable>
        </View>
      </View>

      {!isWide && mobileSearchOpen ? (
        <View style={styles.mobileSearchRow}>
          <View style={[styles.searchBar, { width: "100%" }]}>
            <Ionicons name="search" size={15} color={colors.textMuted} />
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder="Sök upplevelser..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              autoFocus
            />
            {searchValue.length > 0 ? (
              <Pressable onPress={() => onSearchChange("")} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={colors.textFaint} />
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.text,
  },
  navLinks: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  navLink: {
    ...typography.bodyBold,
    color: colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  mobileSearchRow: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 38,
    width: 220,
    flex: undefined,
  },
  searchInput: {
    ...typography.body,
    fontSize: 14,
    color: colors.text,
    flex: 1,
    outlineStyle: "none" as any,
  },
  iconOnly: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.onDark,
  },
});
