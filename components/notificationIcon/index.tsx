import Bell from "@/assets/icons/bell";
import { Colors } from "@/constants/Colors";
import { useLoading } from "@/context/LoadingContext";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
import { getValueFor, save } from "@/hooks/storage";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {};

export default function NotificationIcon({}: Props) {
  const { theme } = useTheme();
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const { hideLoading, showLoading } = useLoading();

  const getNotifications = async () => {
    const now = Date.now();
    await save("lastNotificationUpdate", now.toString());

    showLoading();
    await get("users/getUserNotifications")
      .then((res) => {
        // console.log(res);
        const newNotifications = res.data.data.filter((n: any) => !n.read);
        // console.log(newNotifications);
        setNotificationCount(newNotifications.length);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        hideLoading();
      });
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const pathname = usePathname();
  const appState = useRef(AppState.currentState);

  // Function to handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");

        // Check if current path is feed before refreshing
        const currentPath = pathname;
        console.log(pathname);
        if (currentPath === "/feed" || currentPath === "/programs") {
          console.log("Refetching notifications");
          // Refresh data when app comes to foreground and we're on feed
          (async () => {
            const lastUpdated = await getValueFor("lastNotificationUpdate");
            const now = Date.now();
            if (Number(lastUpdated) && now - Number(lastUpdated) > 60 * 1000) {
              await getNotifications();
              await save("lastNotificationUpdate", now.toString());
            } else {
              console.log("refetch-ed soon");
            }
          })();
        } else {
          console.log("Not on wanted path, skipping refresh");
        }
      }
      appState.current = nextAppState;
    },
    [pathname, getNotifications]
  );

  // Set up AppState listener
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  return (
    <TouchableOpacity
      className="rounded-full w-11 h-11 flex justify-center items-center"
      style={{
        backgroundColor: Colors[theme ?? "light"].bg_primary,
      }}
      onPress={() => {
        setNotificationCount(0);
        router.push("/notifications");
      }}
    >
      {notificationCount != 0 ? (
        <View className="absolute z-10 top-0 right-0 w-5 h-5 flex justify-center items-center bg-red-500 rounded-full">
          <Text className="text-white text-xs font-bold text-center">
            {notificationCount}
          </Text>
        </View>
      ) : null}
      <Bell color={theme === "dark" ? "white" : undefined} />
    </TouchableOpacity>
  );
}
