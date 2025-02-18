import Correct from "@/assets/icons/correct";
import BackButton from "@/components/buttons/backButton";
import PrimaryButton from "@/components/buttons/primary";
import PrimaryLink from "@/components/links/primary";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

export default function SubmitSuccess({}: Props) {
  return (
    <SafeAreaView className="container">
      <BackButton />
      <View className="justify-center items-center">
        <View
          style={{ backgroundColor: Colors.light.primary }}
          className="w-24 h-24 flex justify-center items-center rounded-full mt-7"
        >
          <Correct />
        </View>
        <Text
          className="container text-3xl text-center mt-4"
          style={{ fontFamily: "Poppins_Medium" }}
        >
          Successfully Registered
        </Text>
        <Text
          className="container text-center mt-2"
          style={{ fontFamily: "Poppins_Medium", fontWeight: "light" }}
        >
          Your registration is confirmed! We look forward to seeing you
        </Text>
        <PrimaryLink href={"/feed"} className="mt-12">
          Continue
        </PrimaryLink>
      </View>
    </SafeAreaView>
  );
}
