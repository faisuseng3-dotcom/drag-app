import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 88,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hem",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sista-minuten"
        options={{
          title: "Sista Minuten",
          tabBarIcon: ({ color, size }) => <Ionicons name="flash" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="grupp"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Ionicons name="add" color={colors.onDark} size={30} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sparat"
        options={{
          title: "Sparat",
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -18,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
