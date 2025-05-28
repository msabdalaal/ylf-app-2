import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Program as ProgramType } from "@/constants/types";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import PrimaryLink from "@/components/links/primary";
import { get } from "@/hooks/axios";
import { useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";
import imageUrl from "@/utils/imageUrl";
import dayjs from "dayjs";
import { useTheme } from "@/context/ThemeContext";
import { useLoading } from "@/context/LoadingContext";
import { adjustColorOpacity } from "@/components/cards/programCards";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Program() {
  const { showLoading, hideLoading } = useLoading();
  const { id } = useLocalSearchParams();
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedVision, setExpandedVision] = useState(false);
  const [expandedMission, setExpandedMission] = useState(false);
  const [expandedMore, setExpandedMore] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [program, setProgram] = useState<ProgramType>({
    id: "1",
    achieve: "",
    description: "",
    Image: [],
    mission: "",
    more: "",
    referenceCode: null,
    vision: "",
    name: "",
    startDate: new Date("2022-07-15T00:00:00Z"),
    endDate: new Date("2022-07-26T00:00:00Z"),
    patchNumber: 1,
    forGroups: true,
    acceptApplicationDuration: new Date("2022-07-20T00:00:00Z"),
    logo: { path: "" },
    accentColor: "rgba(42, 154, 151, 0)",
  });
  const getProgram = useCallback(async () => {
    showLoading();
    await get("programs/get/" + id)
      .then((res) => {
        setProgram({ ...res.data.data, isRegistered: res.data.isRegistered });
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);
  useEffect(() => {
    getProgram();
  }, []);
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      {showHeader ? (
        <View className=" container flex-row items-center gap-3 mb-6 mt-5">
          <BackButton />
          <Text
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors[theme ?? "light"].primary,
            }}
          >
            {program.name}
          </Text>
        </View>
      ) : null}
      <View className={`transition-all ${showHeader ? "container" : ""}`}>
        <View
          className={`relative h-80 bg-white overflow-hidden ${
            showHeader ? "rounded-3xl" : "rounded-b-3xl"
          }`}
        >
          <View style={{ filter: "brightness(0.7)" }} className="w-full">
            <Image
              src={imageUrl(program.Image?.[0]?.path)}
              className="w-full h-full object-cover"
            />
          </View>
          <View className={`absolute w-full h-full`}>
            <View
              className={`w-full h-full justify-center  ${
                showHeader ? "px-5" : "container"
              }`}
            >
              <LinearGradient
                colors={[
                  "rgba(0, 0, 0, 0)",
                  adjustColorOpacity(program.accentColor, 0.6),
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              />
              <View className="flex-row justify-between items-center mt-auto mb-4">
                <View>
                  <Text
                    className="text-white font-bold text-xl mt-7"
                    style={{ fontFamily: "Inter" }}
                  >
                    {program.name}
                  </Text>
                  <Text
                    className=" text-[#D4D4D4] text-xs mt-2"
                    style={{ fontFamily: "Inter" }}
                  >
                    {program.name}
                  </Text>
                </View>
                <Image
                  src={imageUrl(program.logo?.path)}
                  className="w-24 h-24"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        className="container flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setShowHeader(offsetY <= 0);
        }}
        scrollEventThrottle={16}
      >
        <Text
          className="font-bold text-lg"
          style={{ color: program.accentColor }}
        >
          Description
        </Text>
        <Text
          className="mt-2.5 dark:text-white"
          ellipsizeMode="tail"
          numberOfLines={expandedDescription ? undefined : 8}
        >
          {program.description}
          {program.description?.length > 0 && program.description?.split('\n').length > 8 && (
            <Text
              style={{ fontFamily: "Inter", color: program.accentColor }}
              onPress={() => setExpandedDescription((prev) => !prev)}
            >
              {" "}{expandedDescription ? "Read Less" : "Read More"}
            </Text>
          )}
        </Text>

        <Text
          className="font-bold text-lg mt-2"
          style={{ color: program.accentColor }}
        >
          Vision
        </Text>
        <Text
          className="mt-2.5 dark:text-white"
          ellipsizeMode="tail"
          numberOfLines={expandedVision ? undefined : 3}
        >
          {program.vision}
          {program.vision?.length > 0 && program.vision?.split('\n').length > 3 && (
            <Text
              style={{ fontFamily: "Inter", color: program.accentColor }}
              onPress={() => setExpandedVision((prev) => !prev)}
            >
              {" "}{expandedVision ? "Read Less" : "Read More"}
            </Text>
          )}
        </Text>

        <Text
          className="font-bold text-lg mt-2"
          style={{ color: program.accentColor }}
        >
          Mission
        </Text>
        <Text
          className="mt-2.5 dark:text-white"
          ellipsizeMode="tail"
          numberOfLines={expandedMission ? undefined : 3}
        >
          {program.mission}
          {program.mission?.length > 0 && program.mission?.split('\n').length > 3 && (
            <Text
              style={{ fontFamily: "Inter", color: program.accentColor }}
              onPress={() => setExpandedMission((prev) => !prev)}
            >
              {" "}{expandedMission ? "Read Less" : "Read More"}
            </Text>
          )}
        </Text>

        <Text
          className="font-bold text-lg mt-2"
          style={{ color: program.accentColor }}
        >
          More about the program
        </Text>
        <Text
          className="mt-2.5 dark:text-white"
          ellipsizeMode="tail"
          numberOfLines={expandedMore ? undefined : 3}
        >
          {program.more}
          {program.more?.length > 0 && program.more?.split('\n').length > 3 && (
            <Text
              style={{ fontFamily: "Inter", color: program.accentColor }}
              onPress={() => setExpandedMore((prev) => !prev)}
            >
              {" "}{expandedMore ? "Read Less" : "Read More"}
            </Text>
          )}
        </Text>
      </ScrollView>
      {dayjs(new Date()).isAfter(dayjs(program.acceptApplicationDuration)) ||
      program.isRegistered ? (
        <View
          className="py-6 px-7 mt-2"
          style={{
            backgroundColor: theme == "dark" ? "#21252d" : "#F0F5FA",
          }}
        >
          <PrimaryLink
            style={{
              backgroundColor:
                dayjs(new Date()).isAfter(
                  dayjs(program.acceptApplicationDuration)
                ) || program.isRegistered
                  ? "#D4D4D4"
                  : program.accentColor,
            }}
            href={`/program/${program.id}/member`}
            disabled={
              dayjs(new Date()).isAfter(
                dayjs(program.acceptApplicationDuration)
              ) || program.isRegistered
            }
          >
            {dayjs(new Date()).isAfter(dayjs(program.acceptApplicationDuration))
              ? "Application Closed"
              : "You are already registered"}
          </PrimaryLink>
        </View>
      ) : (
        <View
          className="py-6 px-7 mt-2"
          style={{
            backgroundColor: theme == "dark" ? "#21252d" : "#F0F5FA",
          }}
        >
          {program.forGroups && (
            <View className="mb-3">
              <PrimaryLink
                style={{
                  backgroundColor:
                    dayjs(new Date()).isAfter(
                      dayjs(program.acceptApplicationDuration)
                    ) || program.isRegistered
                      ? "#D4D4D4"
                      : program.accentColor,
                }}
                href={`/program/${program.id}/member`}
                disabled={
                  dayjs(new Date()).isAfter(
                    dayjs(program.acceptApplicationDuration)
                  ) || program.isRegistered
                }
              >
                {dayjs(new Date()).isAfter(
                  dayjs(program.acceptApplicationDuration)
                )
                  ? "Application Closed"
                  : program.isRegistered
                  ? "You are already registered"
                  : "Apply as a Member"}
              </PrimaryLink>
            </View>
          )}
          <PrimaryLink
            style={{
              backgroundColor:
                dayjs(new Date()).isAfter(
                  dayjs(program.acceptApplicationDuration)
                ) || program.isRegistered
                  ? "#D4D4D4"
                  : program.accentColor,
            }}
            href={`/program/${program.id}/application`}
            disabled={
              dayjs(new Date()).isAfter(
                dayjs(program.acceptApplicationDuration)
              ) || program.isRegistered
            }
          >
            {dayjs(new Date()).isAfter(dayjs(program.acceptApplicationDuration))
              ? "Application Closed"
              : program.isRegistered
              ? "You are already registered"
              : program.forGroups
              ? "Apply as a Group"
              : "Apply Now"}
          </PrimaryLink>
        </View>
      )}
    </SafeAreaView>
  );
}
