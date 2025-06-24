import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import PrimaryButton from "@/components/buttons/primary";
import { post } from "@/hooks/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLoading } from "@/context/LoadingContext";

type Props = {};

const Member = (props: Props) => {
  const { id } = useLocalSearchParams();
  const [referenceCode, setReferenceCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async () => {
    if (!referenceCode.trim()) {
      setError("Reference code is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      showLoading();
      await post(`programs/joinGroup/${referenceCode}`, {
        programId: id,
      });

      hideLoading();
      // On success, navigate to success page
      router.replace(`/program/${id}/submitSuccess`);
    } catch (error: any) {
      console.error("Error joining group:", error);
      setError(
        error?.response?.data?.message ||
          "Failed to join group. Please try again."
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to join group. Please try again."
      );
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="container">

      <View className="flex-row items-center gap-3 my-5">
        <BackButton />
        <Text
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors[theme ?? "light"].primary,
          }}
        >
          Join as a Member
        </Text>
      </View>

      <View className="mt-8">
        <Text
          className="text-lg mb-6 dark:text-white"
          style={{ fontFamily: "Poppins_Medium" }}
        >
          Enter the reference code provided by your group leader
        </Text>

        <TextInputComponent
          value={referenceCode}
          onChange={setReferenceCode}
          placeholder="Reference Code"
          label="Reference Code"
        />

        {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}

        <View className="mt-10">
          <PrimaryButton onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? "Joining..." : "Join Group"}
            </PrimaryButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Member;
