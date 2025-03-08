import { View, Text, FlatList, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/buttons/backButton";
import { get } from "@/hooks/axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { Notification } from "@/constants/types";

const NotificationItem = ({ item }: { item: Notification }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className="p-4 rounded-xl flex-row items-center gap-4 mb-3"
      style={{
        backgroundColor: isDark ? Colors.dark.postBackground : "#F6F8FA",
      }}
    >
      <View className="w-10 h-10 rounded-full justify-center items-center bg-gray-200 dark:bg-gray-800">
        <Text className="text-white text-lg">!</Text>
      </View>
      <View className="flex-1">
        <Text
          className="font-medium mb-1"
          style={{
            fontFamily: "Poppins_Medium",
            color: isDark ? "white" : Colors.light.text,
          }}
        >
          {item.title}
        </Text>
        <Text
          className="text-sm"
          style={{
            color: isDark ? "#9CA3AF" : Colors.light.text,
          }}
        >
          {item.body}
        </Text>
      </View>
    </View>
  );
};

export default function Notifications() {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
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
          color: Colors[colorScheme ?? "light"].primary,
        }}
      >
        {title}
      </Text>
      {data.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </View>
  );

  const getNotifications = async () => {
    await get("users/getUserNotifications")
      .then((res) => {
        setNotifications(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
  };
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <SafeAreaView
      className="container flex-1"
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <View className="flex-row items-center gap-3 mb-6 mt-5">
        <BackButton />
        <Text
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors[colorScheme ?? "light"].primary,
          }}
        >
          Notification
        </Text>
      </View>

      {notifications.filter((n) => dayjs(n.createdAt).isSame(dayjs(), "day"))
        .length > 0 &&
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
    </SafeAreaView>
  );
}
