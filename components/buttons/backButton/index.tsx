import { TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import AngleLeft from "@/assets/icons/Angle-left";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const BackButton = ({ onClick, className, disabled }: Props) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const handleGoBack = () => {
    if (onClick) onClick();
    else navigation.goBack();
  };
  return (
    <TouchableOpacity
      onPress={handleGoBack}
      className={`rounded-full w-11 h-11 flex justify-center items-center ${className}`}
      style={{
        backgroundColor: Colors[theme ?? "light"].bg_primary,
      }}
      disabled={disabled}
    >
      <AngleLeft color={theme == "dark" ? "white" : "#015CA4"} />
    </TouchableOpacity>
  );
};

export default BackButton;
