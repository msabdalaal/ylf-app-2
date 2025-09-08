import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  // Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
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
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// 🔸 ExpandableText Component
const ExpandableText = ({
  label,
  text,
  threshold = 200,
  color,
}: {
  label: string;
  text: string;
  threshold?: number;
  color: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text?.length > threshold;
  const displayedText =
    expanded || !isLong ? text : `${text.slice(0, threshold)}...`;

  return (
    <View className="mt-4">
      <Text className="font-bold text-lg" style={{ color }}>
        {label}
      </Text>
      <Text className="mt-2.5 dark:text-white">
        {displayedText}
        {isLong && (
          <Text
            onPress={() => setExpanded((prev) => !prev)}
            style={{ fontFamily: "Inter", color }}
          >
            {" "}
            {expanded ? "Read Less" : "Read More"}
          </Text>
        )}
      </Text>
    </View>
  );
};

export default function Program() {
  const screenHeight = Dimensions.get("window").height;
  const [contentHeight, setContentHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout>();
  const lastScrollY = useRef(0);
  const HIDE_THRESHOLD = 150; // scroll down past this → hide header
  const SHOW_THRESHOLD = 20; // scroll back up above this → show header
  const SCROLL_DEBOUNCE = 200; // ms

  const { showLoading, hideLoading } = useLoading();
  const { id } = useLocalSearchParams();
  const [showHeader, setShowHeader] = useState(true);
  const [addSpacer, setAddSpacer] = useState(false);
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
  useFocusEffect(
    useCallback(() => {
      setShowHeader(true);
      setContentHeight(0); // reset to force recalculation
    }, [])
  );
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;

      // // if content too short, always show
      // if (contentHeight <= screenHeight - 500) {
      //   if (!showHeader) setShowHeader(true);
      //   return;
      // }

      // Only hide when scrolling down past HIDE_THRESHOLD
      if (offsetY > HIDE_THRESHOLD && showHeader) {
        setShowHeader(false);
      }
      // Only show when scrolling back up above SHOW_THRESHOLD
      else if (offsetY < SHOW_THRESHOLD && !showHeader) {
        setShowHeader(true);
      }

      // debounce resets (optional—keeps it from jittering)
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        // nothing needed here unless you want to “snap” or do other cleanup
      }, SCROLL_DEBOUNCE);
    },
    [contentHeight, screenHeight, showHeader]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);
  const scrollContentRef = useRef<View>(null);

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
    const needsSpacer = height < screenHeight + 100;
    setAddSpacer(needsSpacer);
  };
  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      {showHeader && (
        <View className="container flex-row items-center gap-3 mb-6 mt-5">
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
      )}
      <View className={`transition-all ${showHeader ? "container" : ""}`}>
        <View
          className={`relative h-80 bg-white overflow-hidden ${
            showHeader ? "rounded-3xl" : "rounded-b-3xl"
          }`}
        >
          <View style={{ filter: "brightness(0.7)" }} className="w-full h-full">
            <Image
              source={{ uri: imageUrl(program.Image?.[0]?.path) }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              cachePolicy="disk"
              transition={300}
            />
          </View>
          <View className={`absolute w-full h-full`}>
            <View
              className={`w-full h-full justify-center ${
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
                    className="text-[#D4D4D4] text-xs mt-2"
                    style={{ fontFamily: "Inter" }}
                  >
                    {program.name}
                  </Text>
                </View>
                <Image
                  source={{ uri: imageUrl(program.logo?.path) }}
                  style={{ width: 96, height: 96 }}
                  contentFit="contain"
                  cachePolicy="disk"
                  transition={200}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="container flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View onLayout={handleLayout} ref={scrollContentRef}>
          <ExpandableText
            label="Description"
            text={program.description}
            threshold={250}
            color={program.accentColor}
          />
          <ExpandableText
            label="Vision"
            text={program.vision}
            threshold={200}
            color={program.accentColor}
          />
          <ExpandableText
            label="Mission"
            text={program.mission}
            threshold={200}
            color={program.accentColor}
          />
          <ExpandableText
            label="More about the program"
            text={program.more}
            threshold={200}
            color={program.accentColor}
          />

          {addSpacer && <View style={{ height: 150 }} />}
        </View>
      </ScrollView>

      {dayjs(new Date()).isAfter(dayjs(program.acceptApplicationDuration)) ||
      program.isRegistered ? (
        <View
          className="py-6 px-7 mt-2"
          style={{
            backgroundColor: theme === "dark" ? "#21252d" : "#F0F5FA",
          }}
        >
          <PrimaryLink
            style={{
              backgroundColor: "#D4D4D4",
            }}
            href={`/program/${program.id}/member`}
            disabled
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
            backgroundColor: theme === "dark" ? "#21252d" : "#F0F5FA",
          }}
        >
          {program.forGroups && (
            <View className="mb-3">
              <PrimaryLink
                style={{
                  backgroundColor: program.accentColor,
                }}
                href={`/program/${program.id}/member`}
              >
                Apply as a Member
              </PrimaryLink>
            </View>
          )}
          <PrimaryLink
            style={{
              backgroundColor: program.accentColor,
            }}
            href={`/program/${program.id}/application`}
          >
            {program.forGroups ? "Apply as a Group / Team" : "Apply Now"}
          </PrimaryLink>
        </View>
      )}
    </SafeAreaView>
  );
}
