import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/constants/theme";

export default function ProfilScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={colors.textMuted} />
        </View>
        <Text style={styles.name}>Din profil</Text>
        <Text style={styles.username}>@användarnamn</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Upplevelser" value="0" />
        <Stat label="Följare" value="0" />
        <Stat label="Följer" value="0" />
      </View>

      <View style={styles.tabsRow}>
        {["Kommande", "Tidigare", "Sparat", "Grupper"].map((tab, i) => (
          <View key={tab} style={[styles.tabItem, i === 0 && styles.tabItemActive]}>
            <Text style={[styles.tabText, i === 0 && styles.tabTextActive]}>{tab}</Text>
          </View>
        ))}
      </View>

      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={40} color={colors.textFaint} />
        <Text style={styles.emptyText}>Inga kommande bokningar</Text>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.xl,
    gap: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.title,
    color: colors.text,
  },
  username: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xxl,
    paddingVertical: spacing.xl,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    ...typography.title,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  tabItem: {
    paddingVertical: spacing.sm,
    marginRight: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    ...typography.bodyBold,
    color: colors.textFaint,
  },
  tabTextActive: {
    color: colors.text,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
