import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, typography } from "@/constants/theme";
import { EmptyState } from "@/components/EmptyState";

export default function SparatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Sparat</Text>
      </View>
      <EmptyState
        icon="bookmark-outline"
        title="Inget sparat än"
        subtitle="Tryck på bokmärket på en upplevelse för att spara den här."
      />
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
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
});
