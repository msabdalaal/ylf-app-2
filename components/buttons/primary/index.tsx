import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
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
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-4 rounded-xl w-full ${className}`}
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? Colors[theme ?? "light"].secondary
          : Colors[theme ?? "light"].ButtonPrimary,
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
