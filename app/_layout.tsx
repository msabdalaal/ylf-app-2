import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StatusBar } from "expo-status-bar";
SplashScreen.preventAutoHideAsync();
import "../global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    SF_pro: require("../assets/fonts/SF-Pro.ttf"),
    Inter: require("../assets/fonts/Inter.ttf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
    Poppins_Medium: require("../assets/fonts/Poppins-Medium.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  // const colorScheme = useColorScheme();
  return (
    <>
      <Stack>
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="program/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
