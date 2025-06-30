import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { ReactNode, useState } from "react";
import { Colors } from "@/constants/Colors";
import { EyeClosed } from "@/assets/icons/Eye-closed";
import { EyeOpen } from "@/assets/icons/Eye-open";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
  secure?: boolean;
  disabled?: boolean;
  className?: string;
  onEnter?: () => void;
  error?: string;
  icon?: ReactNode;
  maxLength?: number;
};

const TextInputComponent = ({
  label,
  placeholder,
  value,
  onChange,
  secure,
  disabled,
  className,
  onEnter,
  error,
  icon,
  maxLength,
}: Props) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(true);
  const [focused, setFocused] = useState(false);

  const isDark = theme === "dark";

  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text
          className="mb-2 text-base font-semibold"
          style={{
            color: disabled
              ? isDark
                ? "#6B7280"
                : "#9CA3AF"
              : focused
              ? Colors[theme ?? "light"].primary
              : isDark
              ? "#E5E5E5"
              : Colors.light.text,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View className="relative overflow-hidden">
        {secure ? (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
          >
            {showPassword ? (
              <EyeOpen
                color={
                  focused
                    ? Colors[theme ?? "light"].primary
                    : isDark
                    ? "#6B7280"
                    : Colors.light.border
                }
              />
            ) : (
              <EyeClosed
                color={
                  focused
                    ? Colors[theme ?? "light"].primary
                    : isDark
                    ? "#6B7280"
                    : Colors.light.border
                }
              />
            )}
          </TouchableOpacity>
        ) : null}
        {icon ? (
          <View className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            {icon}
          </View>
        ) : null}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure ? showPassword : false}
          editable={!disabled}
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          className={`w-full overflow-hidden text-left border rounded-xl py-4  ${
            icon ? "pl-12" : "px-5"
          }`}
          style={{
            borderColor: error
              ? "#EF4444"
              : focused
              ? Colors[theme ?? "light"].primary
              : isDark
              ? "#374151"
              : Colors.light.border,
            borderWidth: 2,
            fontFamily: "Poppins_Medium",
            color: isDark ? "#E5E5E5" : Colors.light.text,
            backgroundColor: disabled
              ? isDark
                ? "#1F2937"
                : "#F0F5FA"
              : "transparent",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onEnter}
          maxLength={maxLength}
        />
      </View>
      {error ? (
        <Text
          className="text-red-500 text-sm mt-1 ml-1"
          style={{ fontFamily: "Inter" }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default TextInputComponent;
