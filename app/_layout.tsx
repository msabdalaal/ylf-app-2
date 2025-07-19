import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";
import { save } from "@/hooks/storage";
import { ApplicationContext, ApplicationProvider } from "@/context";
import { usePushNotifications } from "../hooks/useExpoNotification";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { NetworkProvider, useNetwork } from "@/context/NetworkContext";
import NoInternet from "@/components/NoInternet";
import { setupNotifications } from "@/utils/notificationHandler";
import { LoadingProvider } from "@/context/LoadingContext";
import { get } from "@/hooks/axios";
import ServerErrorScreen from "@/components/ServerErrorScreen";
import { PostProvider } from "@/context/postsContext";
import { I18nManager } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    const subscription = setupNotifications();

    return () => {
      subscription.remove();
    };
  }, []);

  // Enforce LTR globally
  React.useEffect(() => {
    if (!I18nManager.isRTL) return;
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
  }, []);

  return (
    <ApplicationProvider>
      <NetworkProvider>
        <ThemeProvider>
          <ThemeWrapper>
            <LoadingProvider>
              <PostProvider>
                <RootLayoutComponent />
              </PostProvider>
            </LoadingProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </NetworkProvider>
    </ApplicationProvider>
  );
}

function RootLayoutComponent() {
  const { isConnected, checkConnection } = useNetwork();
  const [serverDown, setServerDown] = useState(false);

  const { updateState, state } = useContext(ApplicationContext);
  const [loaded] = useFonts({
    SF_pro: require("../assets/fonts/SF-Pro.ttf"),
    Inter: require("../assets/fonts/Inter.ttf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
    Poppins_Medium: require("../assets/fonts/Poppins-Medium.ttf"),
  });
  const { expoPushToken: newToken, notification } = usePushNotifications();

  const checkServerDown = async () => {
    try {
      await get("auth/status");
      setServerDown(false);
    } catch (err) {
      console.error("Server might be down:", err);
      setServerDown(true);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await checkConnection();
      await checkServerDown();
      await SplashScreen.hideAsync();
    };
    if (loaded) {
      initializeApp();
    }
  }, [loaded]);

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

  if (!isConnected) {
    return <NoInternet onRefresh={checkConnection} />;
  }

  if (serverDown) {
    return <ServerErrorScreen onRefresh={checkServerDown} />;
  }

  return (
    <View style={{ flex: 1, direction: "ltr" }}>
      <Stack
        // initialRouteName={initialRoute}
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
        <Stack.Screen
          name="opportunities/[id]/application"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="program/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="program/[id]/application"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="program/[id]/member"
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
    </View>
  );
}
