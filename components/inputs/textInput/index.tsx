import {
  View,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { EyeClosed } from "@/assets/icons/Eye-closed";
import { EyeOpen } from "@/assets/icons/Eye-open";

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
  secure?: boolean;
  disabled?: boolean;
  className?: string;
  onEnter?: () => void;
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
}: Props) => {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(true);
  const [focused, setFocused] = useState(false);
  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text
          className="mb-2 font-semibold"
          style={{
            color: focused
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View className="relative">
        {secure ? (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
          >
            {showPassword ? (
              <EyeOpen
                color={
                  focused
                    ? Colors[colorScheme ?? "light"].primary
                    : Colors[colorScheme ?? "light"].border
                }
              />
            ) : (
              <EyeClosed
                color={
                  focused
                    ? Colors[colorScheme ?? "light"].primary
                    : Colors[colorScheme ?? "light"].border
                }
              />
            )}
          </TouchableOpacity>
        ) : null}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure ? showPassword : false}
          editable={!disabled}
          className={`w-full text-left border rounded-xl py-4 px-5`}
          style={{
            borderColor: focused
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].border,
            borderWidth: 2,
            fontFamily: "Poppins_Medium",
            lineHeight: 20,
            color: focused
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => {
            if (onEnter) {
              onEnter();
            }
          }}
        />
      </View>
    </View>
  );
};

export default TextInputComponent;
