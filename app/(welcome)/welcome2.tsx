import Backdrop from "@/components/backdrop";
import ProgramCard from "@/components/cards/programCards";
import PrimaryLink from "@/components/links/primary";
import SkinnyLink from "@/components/links/skinny";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1 w-full justify-center"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="container flex-1 justify-center">
        <Backdrop />
        <View className="flex-1 justify-center">
          <View className="h-64 mb-6">
            <Image
              source={require("@/assets/images/welcome/welcome2.png")}
              className="h-full"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </View>
          <Text
            className="text-center text-lg mb-5 dark:text-white"
            style={{ fontFamily: "SF_pro", fontWeight: "bold" }}
          >
            Our Mission
          </Text>
          <Text
            className="text-center text-lg font-light mb-5 dark:text-white"
            style={{ fontFamily: "SF_pro" }}
          >
            To Empower potential youth to positively engage in the community by
            developing their leadership skills through the latest national and
            international assessment and development tools.
          </Text>
          <View className="w-full flex-row justify-center items-center gap-2 mb-8">
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#C4C4C4" }}
            ></View>
            <View
              className="h-2 w-6 rounded-full"
              style={{ backgroundColor: Colors.light.primary }}
            ></View>
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#C4C4C4" }}
            ></View>
          </View>
        </View>
        <PrimaryLink href="/welcome3" className="mt-5">
          Next
        </PrimaryLink>
        <SkinnyLink replace={true} href="/login">
          Skip
        </SkinnyLink>
      </View>
    </SafeAreaView>
  );
}
