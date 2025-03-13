import Backdrop from "@/components/backdrop";
import ProgramCard from "@/components/cards/programCards";
import PrimaryLink from "@/components/links/primary";
import SkinnyLink from "@/components/links/skinny";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function index() {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1 w-full container justify-center"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <Backdrop />
      <View className="h-64 mb-6">
        <Image
          source={require("@/assets/images/welcome/welcome3.png")}
          className="h-full"
          style={{ width: "100%", objectFit: "contain" }}
        />
      </View>
      <Text
        className="text-center text-lg mb-5 dark:text-white"
        style={{ fontFamily: "SF_pro", fontWeight: "bold" }}
      >
        Our Vision
      </Text>
      <Text
        className="text-center text-lg font-light mb-5 dark:text-white"
        style={{ fontFamily: "SF_pro" }}
      >
        To develop potential Youth Leaders to inspire and drive change in Egypt
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5 max-h-24"
      >
        {[
          { number: "8,000+", label: "training hours" },
          { number: "109", label: "universities" },
          { number: "611+", label: "student activities" },
          { number: "300,000+", label: "students" },
          { number: "5,000+", label: "vocational school girls" },
        ].map((stat, index) => (
          <View
            key={index}
            className="items-center h-full justify-center mx-3 bg-white/10 px-4 py-2 rounded-lg"
            style={{ minWidth: 120 }}
          >
            <Text
              className="text-xl mb-1"
              style={{
                fontFamily: "SF_pro",
                fontWeight: "bold",
                color: Colors[theme ?? "light"].primary,
              }}
            >
              {stat.number}
            </Text>
            <Text
              className="text-center text-sm dark:text-white"
              style={{ fontFamily: "SF_pro" }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="w-full flex-row justify-center items-center gap-2 mb-8">
        <View
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "#C4C4C4" }}
        ></View>
        <View
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "#C4C4C4" }}
        ></View>
        <View
          className="h-2 w-6 rounded-full"
          style={{ backgroundColor: Colors.light.primary }}
        ></View>
      </View>
      <PrimaryLink replace={true} href="/signup" className="mt-5">
        Sign Up
      </PrimaryLink>
      <SkinnyLink replace={true} href="/login">
        Log In
      </SkinnyLink>
    </SafeAreaView>
  );
}
