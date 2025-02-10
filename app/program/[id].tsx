import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "@/components/buttons/primary";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
type Props = {
  program: {
    name: string;
    startDate: Date;
    endDate: Date;
    patchNumber: number;
    forGroups: boolean;
    acceptApplicationDuration: Date;
    image: any;
    logo: any;
    accentColor: string;
    slogan: string;
  };
};

export default function Program({
  program = {
    name: "Banan Program",
    startDate: new Date("2022-07-15T00:00:00Z"),
    endDate: new Date("2022-07-26T00:00:00Z"),
    patchNumber: 1,
    forGroups: true,
    acceptApplicationDuration: new Date("2022-07-20T00:00:00Z"),
    image: require("@/assets/images/program1.png"),
    logo: require("@/assets/images/programLogo.png"),
    accentColor: "rgba(42, 154, 151, 0.8)",
    slogan: "Jl. Sultan Iskandar Muda, Jakarta selatan",
  },
}: Props) {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedVision, setExpandedVision] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  return (
    <SafeAreaView className="bg-white flex-1">
      {showHeader ? (
        <View className=" container flex-row items-center gap-3 mb-6">
          <BackButton />
          <Text
            className="mt-5"
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors.light.primary,
            }}
          >
            Banan Program
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
              source={program.image}
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
                colors={["rgba(0, 0, 0, 0)", program.accentColor]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              />
              <Image
                source={program.logo}
                className="h-48 w-full"
                resizeMode="contain"
              />
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
                {program.slogan}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        className="container flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        onScroll={(e) => setShowHeader(false)}
        scrollEventThrottle={16}
      >
        <Text
          className="font-bold text-lg"
          style={{ color: program.accentColor }}
        >
          Description
        </Text>
        <Text
          className="mt-2.5"
          ellipsizeMode="tail"
          numberOfLines={expandedDescription ? undefined : 8}
        >
          Banan (بَنَان) is a program Launched in 2023 by Youth Leaders
          Foundation, in collaboration with Attijariwafa Bank Egypt and under
          the auspices of the National Council for Women. Banan focuses on
          empowering all female entrepreneurs, with no limitations or
          restrictions for the female graduates of vocational schools for
          professional and sustainable transformation to expand and maintain
          their businesses, Banan focuses on empowering all female
          entrepreneurs, with no limitations or restrictions for the female
          graduates of vocational schools for professional and sustainable
          transformation to expand and maintain their businesses
        </Text>
        <Text
          className="mt-1"
          style={{ fontFamily: "Inter", color: program.accentColor }}
          onPress={() => {
            setExpandedDescription((prev) => !prev);
          }}
        >
          {expandedDescription ? "Read Less" : "Read More"}
        </Text>
        <Text
          className="font-bold text-lg mt-2"
          style={{ color: program.accentColor }}
        >
          Vision
        </Text>
        <Text
          className="mt-2.5"
          ellipsizeMode="tail"
          numberOfLines={expandedVision ? undefined : 3}
        >
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female,
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female,
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female
        </Text>
        <Text
          className="mt-1"
          style={{ fontFamily: "Inter", color: program.accentColor }}
          onPress={() => {
            setExpandedVision((prev) => !prev);
          }}
        >
          {expandedVision ? "Read Less" : "Read More"}
        </Text>
        <Text
          className="font-bold text-lg mt-2"
          style={{ color: program.accentColor }}
        >
          Mission
        </Text>
        <Text
          className="mt-2.5"
          ellipsizeMode="tail"
          numberOfLines={expandedVision ? undefined : 3}
        >
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female,
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female,
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female
        </Text>
        <Text
          className="mt-1"
          style={{ fontFamily: "Inter", color: program.accentColor }}
          onPress={() => {
            setExpandedVision((prev) => !prev);
          }}
        >
          {expandedVision ? "Read Less" : "Read More"}
        </Text>
        <Text
          className="font-bold text-lg mt-2"
          style={{ color: program.accentColor }}
        >
          More about the program
        </Text>
        <Text
          className="mt-2.5"
          ellipsizeMode="tail"
          numberOfLines={expandedVision ? undefined : 3}
        >
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female,
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female,
          "Banan" is formulated and implemented based on an extensive on ground
          research that reflected deep and concrete understanding of female
        </Text>
        <Text
          className="mt-1"
          style={{ fontFamily: "Inter", color: program.accentColor }}
          onPress={() => {
            setExpandedVision((prev) => !prev);
          }}
        >
          {expandedVision ? "Read Less" : "Read More"}
        </Text>
      </ScrollView>
      <View className="py-6 px-7 bg-[#F0F5FA] mt-2">
        <PrimaryButton
          style={{ backgroundColor: program.accentColor }}
          onPress={() => {}}
        >
          Apply Now
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
