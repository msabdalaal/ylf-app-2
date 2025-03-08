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
import { post } from "@/hooks/axios";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

type Props = {};

const SignUp = (props: Props) => {
  const [Email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otp_first, setOtp_first] = useState("");
  const [otp_second, setOtp_second] = useState("");
  const [otp_third, setOtp_third] = useState("");
  const [otp_fourth, setOtp_fourth] = useState("");
  const [otp_fifth, setOtp_fifth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const handleSendEmail = async () => {
    await post("auth/forgetPassword", { email: Email }).then((res) => {
      alert(res.data.message);
      setEmailSent(true);
    });
  };
  const router = useRouter();
  const handleVerifyOtp = async () => {
    if (
      otp_first.length !== 1 ||
      otp_second.length !== 1 ||
      otp_third.length !== 1 ||
      otp_fourth.length !== 1 ||
      otp_fifth.length !== 1
    ) {
      alert("Please enter the complete otp");
      return;
    }
    setToken("");
    await post("auth/verifyOtp", {
      email: Email,
      otp: `${otp_first}${otp_second}${otp_third}${otp_fourth}${otp_fifth}`,
    }).then((res) => {
      setToken(res.data.data.resetPasswordToken);
    });
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6)
      return alert("Password has to be at least 6 characters long");

    await post("auth/resetPassword", {
      password,
      confirmPassword,
      token,
    }).then((res) => {
      alert(res.data.message);
      router.replace("/login");
    });
  };
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="flex-1 w-full container pt-5"
    style={{
      backgroundColor: Colors[colorScheme ?? "light"].background,
    }}
    >
      {token ? (
        <>
          <Text
            className="mt-6 text-xl"
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors[colorScheme ?? "light"].primary,
            }}
          >
            Create a password
          </Text>
          <Text className="mt-4 dark:text-white" style={{ fontFamily: "Inter" }}>
            In order to keep your account safe you need to create a strong
            password.
          </Text>
          <View className="gap-4 mt-8">
            <TextInputComponent
              label="Password"
              secure={true}
              placeholder="Enter your password"
              value={password}
              onChange={(text) => setPassword(text)}
            />
            <TextInputComponent
              label="Confirm Password"
              secure={true}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(text) => setConfirmPassword(text)}
            />
            <PrimaryButton
              onPress={handleResetPassword}
              disabled={!password || !confirmPassword}
              className="mt-6"
            >
              Reset Password
            </PrimaryButton>
          </View>
        </>
      ) : emailSent ? (
        <>
          <BackButton onClick={() => setEmailSent(false)} />
          <Text
            className="mt-6 text-xl"
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors[colorScheme ?? "light"].primary,
            }}
          >
            Check your email
          </Text>
          <Text className="mt-4 dark:text-white" style={{ fontFamily: "Inter" }}>
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
            onPress={handleVerifyOtp}
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
              color: Colors[colorScheme ?? "light"].primary,
            }}
          >
            Forgot password
          </Text>
          <Text className="mt-4 dark:text-white" style={{ fontFamily: "Inter" }}>
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
