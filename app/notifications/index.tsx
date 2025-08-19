import { View, Text, FlatList, Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/buttons/backButton";
import { get } from "@/hooks/axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { Notification, Program } from "@/constants/types";
import { useTheme } from "@/context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLoading } from "@/context/LoadingContext";
import { AppState, AppStateStatus } from "react-native";
import imageUrl from "@/utils/imageUrl";
import * as Linking from "expo-linking";
import { getValueFor, save } from "@/hooks/storage";

export default function Notifications() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const appState = useRef(AppState.currentState);

  const [programs, setPrograms] = useState<Program[]>([]);
  const getPrograms = useCallback(async () => {
    try {
      const res = await get("programs/getAll");
      setPrograms(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getPrograms();
  }, [getPrograms]);

  const NotificationItem = useCallback(
    ({ item }: { item: Notification }) => {
      const { theme } = useTheme();
      const isDark = theme === "dark";

      const handlePress = () => {
        if (item.link) {
          router.push(item.link as any);
        }
      };

      const getTimeDisplay = (createdAt: string) => {
        const now = dayjs();
        const created = dayjs(createdAt);
        const hoursDiff = now.diff(created, "hour");

        if (hoursDiff < 24) {
          if (hoursDiff < 1) {
            const minutesDiff = now.diff(created, "minute");
            return `${minutesDiff} minutes ago`;
          }
          return `${hoursDiff} hours ago`;
        }
        return created.format("MMM D, YYYY");
      };
      return (
        <TouchableOpacity
          onPress={handlePress}
          disabled={!item.link}
          className="p-4 rounded-xl flex-row items-center gap-4 mb-3 active:opacity-80"
          style={{
            backgroundColor: isDark ? Colors.dark.postBackground : "#F6F8FA",
          }}
        >
          <View className="w-12 h-12 p-2 rounded-full overflow-hidden bg-gray-200">
            {item.programId ? (
              <Image
                src={imageUrl(
                  programs.find((p) => p.id === item.programId)?.logo.path ?? ""
                )}
                resizeMode="contain"
                className="w-full h-full rounded-full"
              />
            ) : (
              <Image
                source={require("@/assets/images/splash-icon.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}
          </View>

          <View className="flex-1 flex-row items-center gap-2">
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text
                  className="font-medium"
                  style={{
                    fontFamily: "Poppins_Medium",
                    color: isDark ? "white" : Colors.light.text,
                  }}
                >
                  {item.title}
                </Text>
              </View>
              <Text
                className="text-sm"
                style={{
                  color: isDark ? "#9CA3AF" : Colors.light.text,
                }}
              >
                {renderTextWithLinks(item.body, isDark)}
              </Text>
              <Text
                className="text-xs mt-1"
                style={{
                  color: isDark ? "#9CA3AF" : Colors.light.text,
                }}
              >
                {getTimeDisplay(item.createdAt.toString())}
              </Text>
            </View>
            {item.link && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? "#9CA3AF" : Colors.light.text}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [programs]
  );

  const renderSection = ({
    title,
    data,
  }: {
    title: string;
    data: Notification[];
  }) => (
    <View className="mb-6">
      <Text
        className="mb-3"
        style={{
          fontFamily: "Poppins_Medium",
          color: Colors[theme ?? "light"].primary,
        }}
      >
        {title}
      </Text>
      {data.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </View>
  );

  const getNotifications = async (refresh = false) => {

    const now = Date.now();
    await save("lastNotificationUpdate", now.toString());

    showLoading();
    await get("users/getUserNotifications")
      .then((res) => {
        setNotifications(res.data.data);
      })
      .then(async () => {
        await get("users/readAllNotifications");
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getNotifications(true);
    setRefreshing(false);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  // Function to handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // Refresh notifications when app comes to foreground
        (async () => {
          const lastUpdated = await getValueFor("lastNotificationUpdate");
          const now = Date.now();
          if (Number(lastUpdated) && now - Number(lastUpdated) > 60 * 1000) {
            await getNotifications();
            await save("lastNotificationUpdate", now.toString());
          }
        })();
      }
      appState.current = nextAppState;
    },
    [getNotifications]
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

  // Utility to render text with clickable links
  function renderTextWithLinks(text: string, isDark: boolean) {
    if (!text) return null;
    // Improved regex to match URLs including TLDs and trailing slashes/paths
    // This will match e.g. https://gg.deals/ as a whole, not just https://gg
    // It matches http(s):// or www., then domain, then optional path/query/fragment
    const urlRegex =
      /((https?:\/\/|www\.)[a-zA-Z0-9\-._~%]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/[^\s]*)?)/gi;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(
          <Text
            key={key++}
            style={{ color: isDark ? "white" : Colors.light.text }}
          >
            {text.slice(lastIndex, match.index)}
          </Text>
        );
      }
      let url = match[0];
      // Ensure url has protocol for www. links
      let openUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : url.startsWith("www.")
          ? `https://${url}`
          : url;
      parts.push(
        <Text
          key={key++}
          style={{
            color: Colors.light.primary,
            textDecorationLine: "underline",
          }}
          onPress={() => Linking.openURL(openUrl)}
          suppressHighlighting
        >
          {url}
        </Text>
      );
      lastIndex = match.index + url.length;
    }
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(
        <Text
          key={key++}
          style={{ color: isDark ? "white" : Colors.light.text }}
        >
          {text.slice(lastIndex)}
        </Text>
      );
    }
    return parts;
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="container flex-1">
        <View className="flex-row items-center gap-3 mb-6 mt-5">
          <BackButton />
          <Text
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors[theme ?? "light"].primary,
            }}
          >
            Notification
          </Text>
        </View>
        <FlatList
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          data={[1]}
          renderItem={() => (
            <View>
              {notifications.filter((n) =>
                dayjs(n.createdAt).isSame(dayjs(), "day")
              ).length > 0 &&
                renderSection({
                  title: "Today",
                  data: notifications.filter((n) =>
                    dayjs(n.createdAt).isSame(dayjs(), "day")
                  ),
                })}
              {notifications.filter((n) =>
                dayjs(n.createdAt).isSame(dayjs().subtract(1, "day"), "day")
              ).length > 0 &&
                renderSection({
                  title: "Yesterday",
                  data: notifications.filter((n) =>
                    dayjs(n.createdAt).isSame(dayjs().subtract(1, "day"), "day")
                  ),
                })}
              {notifications.filter((n) =>
                dayjs(n.createdAt).isBefore(dayjs().subtract(1, "day"), "day")
              ).length > 0 &&
                renderSection({
                  title: "Older",
                  data: notifications.filter((n) =>
                    dayjs(n.createdAt).isBefore(
                      dayjs().subtract(1, "day"),
                      "day"
                    )
                  ),
                })}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
