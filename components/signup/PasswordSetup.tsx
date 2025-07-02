import React from "react";
import { Text, View } from "react-native";
import BackButton from "@/components/buttons/backButton";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { formData } from "@/app/(auth)/signup";
import { SafeAreaView } from "react-native-safe-area-context";

interface PasswordSetupProps {
  formData: formData;
  setFormData: (data: formData) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  onBack: () => void;
}

function getPasswordErrors(password: string, confirmPassword: string) {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("At least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least one capital letter");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("At least one special character");
  }
  if (confirmPassword && password !== confirmPassword) {
    errors.push("Passwords do not match");
  }
  return errors;
}

export default function PasswordSetup({
  formData,
  setFormData,
  confirmPassword,
  setConfirmPassword,
  onBack,
}: PasswordSetupProps) {
  const passwordErrors = getPasswordErrors(formData.password, confirmPassword);
  return (
    <SafeAreaView>
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
      <Text className="mt-4 dark:text-white" style={{ fontFamily: "Inter" }}>
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
        {passwordErrors.length > 0 && (
          <View className="mt-2">
            {passwordErrors.map((err, idx) => (
              <Text
                key={idx}
                style={{ color: "#E41D1D", fontSize: 13, fontFamily: "Inter" }}
              >
                • {err}
              </Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
