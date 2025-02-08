import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import { Pressable, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/textInput";
import PrimaryButton from "@/components/buttons/primary";
import OTP from "@/components/inputs/otp";
import SkinnyLink from "@/components/links/skinny";
import SkinnyButton from "@/components/buttons/skinny";

type Props = {};

const SignUp = (props: Props) => {
  const [Email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otp_first, setOtp_first] = useState("");
  const [otp_second, setOtp_second] = useState("");
  const [otp_third, setOtp_third] = useState("");
  const [otp_fourth, setOtp_fourth] = useState("");
  const [otp_fifth, setOtp_fifth] = useState("");
  const handleSendEmail = async () => {
    setEmailSent(true);
  };
  return (
    <SafeAreaView className="flex-1 w-full container bg-white">
      {emailSent ? (
        <>
          <BackButton onClick={() => setEmailSent(false)} />
          <Text
            className="mt-6 text-xl"
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors.light.primary,
            }}
          >
            Check your email
          </Text>
          <Text className="mt-4" style={{ fontFamily: "Inter" }}>
            We sent a reset link to <Text className="font-bold">{Email}</Text>{" "}
            enter 5 digit code that mentioned in the email
          </Text>
          <OTP
            onChange1={setOtp_first}
            onChange2={setOtp_second}
            onChange3={setOtp_third}
            onChange4={setOtp_fourth}
            onChange5={setOtp_fifth}
            value1={otp_first}
            value2={otp_second}
            value3={otp_third}
            value4={otp_fourth}
            value5={otp_fifth}
            className="mt-8"
          />
          <PrimaryButton
            onPress={handleSendEmail}
            disabled={
              !(otp_first && otp_second && otp_third && otp_fourth && otp_fifth)
            }
            className="mt-6"
          >
            Verify Code
          </PrimaryButton>
          <View className="flex-row justify-center mt-8">
            <Text>Haven't got the email yet? </Text>
            <Pressable onPress={() => {}}>
              <Text
                style={{
                  color: Colors.light.primary,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Resend email
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <BackButton />
          <Text
            className="mt-6 text-xl"
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors.light.primary,
            }}
          >
            Forgot password
          </Text>
          <Text className="mt-4" style={{ fontFamily: "Inter" }}>
            Please enter your email to reset the password
          </Text>
          <TextInputComponent
            label="Your Email"
            placeholder="Enter your email"
            className="mt-8"
            onChange={(text) => setEmail(text)}
            value={Email}
          />
          <PrimaryButton
            onPress={handleSendEmail}
            disabled={!Email}
            className="mt-6"
          >
            Reset Password
          </PrimaryButton>
        </>
      )}
    </SafeAreaView>
  );
};

export default SignUp;
