import BackButton from "@/components/buttons/backButton";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

export default function Program({}: Props) {
  return (
    <SafeAreaView className="container bg-white flex-1">
      <BackButton />
      <Text className="mt-5">Program</Text>
    </SafeAreaView>
  );
}
