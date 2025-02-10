import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
interface PrimaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
  style?: any;
}

const PrimaryButton = ({
  children,
  onPress,
  className,
  disabled = false,
  style = {},
}: PrimaryButtonProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-4 rounded-xl w-full ${className}`}
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? Colors[colorScheme ?? "light"].secondary
          : Colors[colorScheme ?? "light"].primary,
        ...style,
      }}
    >
      <Text
        style={{ fontFamily: "Inter" }}
        className="text-white font-bold text-center"
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
