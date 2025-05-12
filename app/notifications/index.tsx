import { View, Text, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/buttons/backButton";
import { get, post } from "@/hooks/axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { Notification } from "@/constants/types";
import { ApplicationContext } from "@/context";
import { useTheme } from "@/context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLoading } from "@/context/LoadingContext";
import NotificationBell from "@/assets/icons/NotificationBell";

const NotificationItem = ({ item }: { item: Notification }) => {
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
      <NotificationBell />

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
            {item.body}
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
};

export default function Notifications() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { showLoading, hideLoading } = useLoading();

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
    showLoading();
    await get("users/getUserNotifications")
      .then((res) => {
        setNotifications(res.data.data);
      })
      .then(async () => {
        const result = await get("users/readAllNotifications");
        console.log(result);
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

  return (
    <SafeAreaView
      className="container flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
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
                  dayjs(n.createdAt).isBefore(dayjs().subtract(1, "day"), "day")
                ),
              })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
