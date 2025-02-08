import { TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import AngleLeft from "@/assets/icons/Angle-left";
import { Colors } from "@/constants/Colors";

type Props = {
  onClick?: () => void;
};

const BackButton = ({ onClick }: Props) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const handleGoBack = () => {
    if (onClick) onClick();
    else navigation.goBack();
  };
  return (
    <TouchableOpacity
      onPress={handleGoBack}
      className="rounded-full w-11 h-11 flex justify-center items-center mt-5"
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].bg_primary,
      }}
    >
      <AngleLeft />
    </TouchableOpacity>
  );
};

export default BackButton;
