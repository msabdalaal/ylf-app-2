import { Colors } from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event as EventType } from "@/constants/types";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import PrimaryLink from "@/components/links/primary";
import { get } from "@/hooks/axios";
import { useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";

import { useTheme } from "@/context/ThemeContext";
import { useLoading } from "@/context/LoadingContext";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Event() {
  const { showLoading, hideLoading } = useLoading();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<EventType>();
  const getEvent = useCallback(async () => {
    showLoading();
    await get("events/get/" + id)
      .then((res) => {
        setEvent({ ...res.data.data, isRegistered: res.data.isRegistered });
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);
  useEffect(() => {
    getEvent();
  }, []);
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="px-7 py-5">
        <Text className="text-2xl font-bold text-black">{event?.name}</Text>
      </View>
      <View
        className="py-6 px-7 mt-auto"
        style={{
          backgroundColor: theme == "dark" ? "#21252d" : "#F0F5FA",
        }}
      >
        <PrimaryLink href={`/event/${event?.id}/application`}>
          Apply Now
        </PrimaryLink>
      </View>
    </SafeAreaView>
  );
}
