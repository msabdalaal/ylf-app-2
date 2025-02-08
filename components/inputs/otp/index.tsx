import { View, TextInput, useColorScheme } from "react-native";
import React, { useState, useRef } from "react";
import { Colors } from "@/constants/Colors";

type Props = {
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  onChange1: (text: string) => void;
  onChange2: (text: string) => void;
  onChange3: (text: string) => void;
  onChange4: (text: string) => void;
  onChange5: (text: string) => void;
  className?: string;
};

const OTP = ({
  value1,
  value2,
  value3,
  value4,
  value5,
  onChange1,
  onChange2,
  onChange3,
  onChange4,
  onChange5,
  className
}: Props) => {
  const colorScheme = useColorScheme();
  const [focused, setFocused] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const input1 = useRef<TextInput>(null);
  const input2 = useRef<TextInput>(null);
  const input3 = useRef<TextInput>(null);
  const input4 = useRef<TextInput>(null);
  const input5 = useRef<TextInput>(null);

  const handleFocus = (num: number) => () =>
    setFocused((prev) => ({ ...prev, [num]: true }));
  const handleBlur = (num: number) => () =>
    setFocused((prev) => ({ ...prev, [num]: false }));

  const handleChange = (
    num: number,
    value: string,
    onChange: (text: string) => void
  ) => {
    onChange(value);
    if (value.length === 1) {
      const nextInput = [input1, input2, input3, input4, input5][num];
      nextInput?.current?.focus();
    }
  };

  return (
    <View className={`w-full flex-row justify-between ${className}`}>
      <TextInput
        maxLength={1}
        className="border w-14 h-14 text-center text-lg rounded-xl"
        style={{
          borderWidth: 2,
          borderColor:
            focused[1] || value1 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].border,
          color:
            focused[1] || value1 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          fontFamily: "Poppins_Medium",
          lineHeight: 20,
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={input1}
        onFocus={handleFocus(1)}
        onBlur={handleBlur(1)}
        value={value1}
        onChangeText={(text) => handleChange(1, text, onChange1)}
      />
      <TextInput
        maxLength={1}
        className="border w-14 h-14 text-center text-lg rounded-xl"
        style={{
          borderWidth: 2,
          borderColor:
            focused[2] || value2 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].border,
          color:
            focused[2] || value2 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          fontFamily: "Poppins_Medium",
          lineHeight: 20,
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={input2}
        onFocus={handleFocus(2)}
        onBlur={handleBlur(2)}
        value={value2}
        onChangeText={(text) => handleChange(2, text, onChange2)}
      />
      <TextInput
        maxLength={1}
        className="border w-14 h-14 text-center text-lg rounded-xl"
        style={{
          borderWidth: 2,
          borderColor:
            focused[3] || value3 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].border,
          color:
            focused[3] || value3 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          fontFamily: "Poppins_Medium",
          lineHeight: 20,
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={input3}
        onFocus={handleFocus(3)}
        onBlur={handleBlur(3)}
        value={value3}
        onChangeText={(text) => handleChange(3, text, onChange3)}
      />
      <TextInput
        maxLength={1}
        className="border w-14 h-14 text-center text-lg rounded-xl"
        style={{
          borderWidth: 2,
          borderColor:
            focused[4] || value4 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].border,
          color:
            focused[4] || value4 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          fontFamily: "Poppins_Medium",
          lineHeight: 20,
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={input4}
        onFocus={handleFocus(4)}
        onBlur={handleBlur(4)}
        value={value4}
        onChangeText={(text) => handleChange(4, text, onChange4)}
      />
            <TextInput
        maxLength={1}
        className="border w-14 h-14 text-center text-lg rounded-xl"
        style={{
          borderWidth: 2,
          borderColor:
            focused[5] || value5 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].border,
          color:
            focused[5] || value5 !== ""
              ? Colors[colorScheme ?? "light"].primary
              : Colors[colorScheme ?? "light"].text,
          fontFamily: "Poppins_Medium",
          lineHeight: 20,
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={input5}
        onFocus={handleFocus(5)}
        onBlur={handleBlur(5)}
        value={value5}
        onChangeText={(text) => handleChange(5, text, onChange5)}
      />
    </View>
  );
};

export default OTP;
