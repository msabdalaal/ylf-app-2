import React, { useEffect, useState, useContext } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import "../global.css";
import { getValueFor, save } from "@/hooks/storage";
import { ApplicationContext, ApplicationProvider } from "@/context";
import { usePushNotifications } from "../hooks/useExpoNotification";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { NetworkProvider, useNetwork } from "@/context/NetworkContext";
import NoInternet from "@/components/NoInternet";
import ServerErrorScreen from "@/components/ServerErrorScreen";
import { setupNotifications } from "@/utils/notificationHandler";
import { LoadingProvider } from "@/context/LoadingContext";
import { get } from "@/hooks/axios";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const subscription = setupNotifications();
    return () => subscription.remove();
  }, []);

  return (
    <ApplicationProvider>
      <NetworkProvider>
        <ThemeProvider>
          <ThemeWrapper>
            <LoadingProvider>
              <RootLayoutNav />
            </LoadingProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </NetworkProvider>
    </ApplicationProvider>
  );
}

function RootLayoutNav() {
  const { isConnected, checkConnection } = useNetwork();
  const [fontsLoaded] = useFonts({
    SF_pro: require("../assets/fonts/SF-Pro.ttf"),
    Inter: require("../assets/fonts/Inter.ttf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
    Poppins_Medium: require("../assets/fonts/Poppins-Medium.ttf"),
  });

  const [appReady, setAppReady] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await checkConnection();

      try {
        await get("posts/getAll", { params: { page: 1 } });
        setServerDown(false);
      } catch (err) {
        console.error("Server might be down:", err);
        setServerDown(true);
      }

      const token = await getValueFor("token");
      const hasViewedWelcome = await getValueFor("hasViewedWelcome");

      if (token) {
        router.replace("/feed");
      } else if (hasViewedWelcome === "true") {
        router.replace("/login");
      } else {
        await save("hasViewedWelcome", "true");
        router.replace("/");
      }

      await SplashScreen.hideAsync();
      setAppReady(true);
    };

    if (fontsLoaded) init();
  }, [fontsLoaded]);

  if (!fontsLoaded || !appReady) return null;
  if (!isConnected) return <NoInternet onRefresh={() => checkConnection()} />;
  if (serverDown)
    return <ServerErrorScreen onRefresh={() => checkConnection()} />;

  return <RootLayoutComponent />;
}

function RootLayoutComponent() {
  const { updateState, state } = useContext(ApplicationContext);
  const { expoPushToken: newToken, notification } = usePushNotifications();

  useEffect(() => {
    if (!newToken?.data) return;

    const updateTokenIfNeeded = async () => {
      try {
        await save("pushToken", newToken.data);

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
      console.log("Received notification:", notification);
    }
  }, [notification]);

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
        <Stack.Screen name="(welcome)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="settings/profile/index" />
        <Stack.Screen name="settings/profile/edit" />
        <Stack.Screen name="settings/profile/qrCode" />
        <Stack.Screen name="post/[id]" />
        <Stack.Screen name="opportunities/[id]/index" />
        <Stack.Screen name="opportunities/[id]/application" />
        <Stack.Screen name="program/[id]" />
        <Stack.Screen name="program/[id]/application" />
        <Stack.Screen name="program/[id]/member" />
        <Stack.Screen name="program/[id]/submitSuccess" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="notifications/index" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
