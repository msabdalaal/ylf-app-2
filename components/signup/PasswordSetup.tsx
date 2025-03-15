import React from "react";
import { Text, View } from "react-native";
import BackButton from "@/components/buttons/backButton";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { formData } from "@/app/(auth)/signup";

interface PasswordSetupProps {
  formData: formData;
  setFormData: (data: formData) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  onBack: () => void;
}

export default function PasswordSetup({
  formData,
  setFormData,
  confirmPassword,
  setConfirmPassword,
  onBack,
}: PasswordSetupProps) {
  return (
    <>
      <BackButton onClick={onBack} />
      <Text
        className="mt-6 text-xl"
        style={{
          fontFamily: "Poppins_Medium",
          color: Colors.light.primary,
        }}
      >
        Create a password
      </Text>
      <Text className="mt-4" style={{ fontFamily: "Inter" }}>
        In order to keep your account safe you need to create a strong password.
      </Text>
      <View className="gap-4 mt-8">
        <TextInputComponent
          label="Password"
          secure={true}
          placeholder="Enter your password"
          value={formData.password}
          onChange={(text) => setFormData({ ...formData, password: text })}
        />
        <TextInputComponent
          label="Confirm Password"
          secure={true}
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(text) => setConfirmPassword(text)}
        />
      </View>
    </>
  );
}