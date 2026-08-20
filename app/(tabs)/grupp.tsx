import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { colors, spacing, typography } from "@/constants/theme";
import { getGroupEvents } from "@/services/groupEvents";
import { GroupEvent } from "@/types";
import { GroupEventCard } from "@/components/GroupEventCard";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";

export default function GruppScreen() {
  const [events, setEvents] = useState<GroupEvent[] | null>(null);

  const load = useCallback(() => {
    getGroupEvents().then(setEvents);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mina grupper</Text>
        <Button label="+ Skapa grupp" onPress={() => router.push("/group/new")} style={styles.createButton} />
      </View>

      {!events ? (
        <ActivityIndicator color={colors.text} style={{ marginTop: spacing.xl }} />
      ) : events.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState
            icon="people-outline"
            title="Inga grupp-event än"
            subtitle="Bjud in vänner, rösta på upplevelse och datum, och boka tillsammans."
          />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GroupEventCard event={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    gap: spacing.md,
  },
  title: {
    ...typography.hero,
    fontSize: 26,
    color: colors.text,
  },
  createButton: {
    alignSelf: "flex-start",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
