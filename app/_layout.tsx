// app/_layout.tsx

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
