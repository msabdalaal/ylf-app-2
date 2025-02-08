import Backdrop from "@/components/backdrop";
import ProgramCard from "@/components/cards/programCards";
import PrimaryLink from "@/components/links/primary";
import SkinnyLink from "@/components/links/skinny";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  return (
    <SafeAreaView className="flex-1 w-full container justify-center">
      <Backdrop />
      <View className="h-64 mb-6">
        <Image
          source={require("@/assets/images/welcome/welcome3.png")}
          className="h-full"
          style={{ width: "100%", objectFit: "contain" }}
        />
      </View>
      <Text
        className="text-center text-lg mb-5"
        style={{ fontFamily: "SF_pro", fontWeight: "bold" }}
      >
        Find Friends & Get Inspiration
      </Text>
      <Text
        className="text-center text-lg font-light mb-5"
        style={{ fontFamily: "SF_pro" }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Erat vitae quis
        quam augue quam a.
      </Text>
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
