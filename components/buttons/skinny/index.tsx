import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
interface PrimaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
  textClassName?: string;
}

const SkinnyButton = ({
  children,
  onPress,
  className,
  disabled = false,
  textClassName,
}: PrimaryButtonProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-[18px] rounded-lg ${className}`}
      disabled={disabled}
    >
      <Text
        style={{
          fontFamily: "Inter",
          color: Colors[colorScheme ?? "light"].primary,
        }}
        className={`text-center ${textClassName}`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default SkinnyButton;
