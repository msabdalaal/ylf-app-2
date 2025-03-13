import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StatusBar } from "expo-status-bar";
SplashScreen.preventAutoHideAsync();
import "../global.css";
import { getValueFor, save } from "@/hooks/storage";
import { ApplicationContext, ApplicationProvider } from "@/context";
import { usePushNotifications } from "../hooks/useExpoNotification";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeWrapper } from "@/components/ThemeWrapper";

export default function RootLayout() {
  return (
    <ApplicationProvider>
      <ThemeProvider>
        <ThemeWrapper>
          <RootLayoutComponent />
        </ThemeWrapper>
      </ThemeProvider>
    </ApplicationProvider>
  );
}

function RootLayoutComponent() {
  const { updateState, state } = useContext(ApplicationContext);
  const [loaded] = useFonts({
    SF_pro: require("../assets/fonts/SF-Pro.ttf"),
    Inter: require("../assets/fonts/Inter.ttf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
    Poppins_Medium: require("../assets/fonts/Poppins-Medium.ttf"),
  });
  const router = useRouter();
  const { expoPushToken: newToken, notification } = usePushNotifications();

  const checkToken = async () => {
    const token = await getValueFor("token");
    const hasViewedWelcome = await getValueFor("hasViewedWelcome");
    if (token) {
      router.replace("/feed");
    } else if (hasViewedWelcome === "true") {
      router.replace("/login");
    } else {
      router.replace("/");
      await save("hasViewedWelcome", "true");
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await checkToken();
      SplashScreen.hideAsync();
    };

    let timer: NodeJS.Timeout | null = null;
    if (loaded) {
      initializeApp();
    } else {
      timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loaded]);

  useEffect(() => {
    if (!newToken?.data) return;

    const updateTokenIfNeeded = async () => {
      try {
        // Store token locally first
        await save("pushToken", newToken.data);
        
        // Only update if different from current
        if (state?.user && state.expoPushToken !== newToken.data) {
          console.log("Updating push token:", newToken.data);
          updateState("expoPushToken", newToken.data);
        }
      } catch (error) {
        console.error("Error updating push token:", error);
      }
    };

    updateTokenIfNeeded();
  }, [newToken?.data, updateState, state?.user]);

  useEffect(() => {
    if (notification) {
      // Handle received notification
      console.log("Received notification:", notification);
    }
  }, [notification]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureDirection: "horizontal",
          animation: "slide_from_right",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings/profile/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="settings/profile/edit"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="settings/profile/qrCode"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="opportunities/[id]/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="program/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="program/[id]/application"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="program/[id]/submitSuccess"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="auth/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="notifications/index"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
