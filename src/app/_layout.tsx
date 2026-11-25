import { Figtree_400Regular, Figtree_600SemiBold, Figtree_700Bold } from "@expo-google-fonts/figtree";
import { Fraunces_400Regular, Fraunces_400Regular_Italic } from "@expo-google-fonts/fraunces";
import { LeagueGothic_400Regular } from "@expo-google-fonts/league-gothic";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { Splash } from "@/components/splash";
import { StoreProvider } from "@/lib/store";
import { c } from "@/theme";

SplashScreen.preventAutoHideAsync();
// Expected inside Expo Go: only remote push is missing there, and the app uses local reminders.
LogBox.ignoreLogs([/expo-notifications/]);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_400Regular, Fraunces_400Regular_Italic, LeagueGothic_400Regular,
    Figtree_400Regular, Figtree_600SemiBold, Figtree_700Bold,
  });
  useEffect(() => { if (loaded || error) SplashScreen.hideAsync(); }, [loaded, error]);
  if (!loaded && !error) return null;

  return (
    <StoreProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.porcelain } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" options={{ animation: "fade", gestureEnabled: false }} />
        <Stack.Screen name="visit/[ref]" />
        <Stack.Screen name="guide" />
        <Stack.Screen name="legal/[doc]" options={{ presentation: "modal" }} />
        <Stack.Screen name="look/[id]" />
      </Stack>
      <Splash />
    </StoreProvider>
  );
}
