import { useCallback } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold, Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayout = useCallback(() => {}, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="experience/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="booking/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="group/new" options={{ presentation: "modal" }} />
        <Stack.Screen name="group/[id]" options={{ presentation: "card" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
