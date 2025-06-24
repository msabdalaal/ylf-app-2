import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import TextInputComponent from "@/components/inputs/textInput";
import PrimaryButton from "@/components/buttons/primary";
import { Colors } from "@/constants/Colors";
import { get, post } from "@/hooks/axios";
import { remove, save } from "@/hooks/storage";
import validator from "validator";
import { AxiosError } from "axios";
import FingerPrint from "@/assets/icons/fingerPrint";
import TopBarTabs from "@/components/topBar/tabs";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { ApplicationContext } from "@/context";
import SkinnyLink from "@/components/links/skinny";
import { useTheme } from "@/context/ThemeContext";
import { isProfileComplete } from "@/utils/profileComplete";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const router = useRouter();
  const { updateState } = useContext(ApplicationContext);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      const storedEmail = await SecureStore.getItemAsync("email");
      const storedPassword = await SecureStore.getItemAsync("password");
      setIsBiometricSupported(
        isBiometricAvailable &&
          savedBiometrics &&
          !!storedEmail &&
          !!storedPassword
      );
    };

    checkBiometricSupport();
  }, []);

  const getProfile = useCallback(async () => {
    const user = await get("users/profile").then((res) => {
      const user = res.data.data;
      updateState("user", user);
      return user;
    });

    return user;
  }, []);

  const handleLogin = async ({
    email = formData.email,
    password = formData.password,
  }: {
    email?: string;
    password?: string;
  }) => {
    if (!validator.isEmail(email.toLowerCase())) return alert("Invalid Email");
    if (password === "") return alert("Password cannot be empty");

    try {
      const res = await post(
        "auth/login",
        email && password ? { email: email.toLowerCase(), password } : formData
      );
      const token = res.data.access_token;
      await save("token", token);

      const user = await getProfile();
      if (!isProfileComplete(user)) {
        await remove("token");
        router.replace({
          pathname: "/auth",
          params: { token: res.data.access_token },
        });
      } else {
        await SecureStore.setItemAsync("email", email.toLowerCase());
        await SecureStore.setItemAsync("password", password);
        router.replace("/feed");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
      console.log(error);
    }
  };

  // Handle Biometric Login
  const handleBioMetricLogin = async () => {
    if (!isBiometricSupported) {
      alert("Biometric authentication is not available.");
      return;
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Log in with biometrics",
      disableDeviceFallback: true,
      fallbackLabel: "Enter password",
      cancelLabel: "Cancel",
    });

    if (biometricAuth.success) {
      const storedEmail = await SecureStore.getItemAsync("email");
      const storedPassword = await SecureStore.getItemAsync("password");

      if (!storedEmail || !storedPassword) {
        alert("No credentials found. Please log in manually first.");
        return;
      }
      handleLogin({
        email: storedEmail.toLocaleLowerCase(),
        password: storedPassword,
      });
    } else {
      alert("Biometric authentication failed.");
    }
  };

  const handleGoogleSignIn = async () => {
    const redirect = Linking.createURL("/");

    await WebBrowser.openAuthSessionAsync(
      `https://mobile.ylf-eg.org/api/auth/google`,
      redirect
    );
  };
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 w-full container bg-white"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <TopBarTabs
        links={[
          { name: "Log In", link: "/login" },
          { name: "Sign Up", link: "/signup" },
        ]}
      />
      <View className="mt-16 gap-4">
        <TextInputComponent
          label="Email Address"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInputComponent
          label="Password"
          secure={true}
          placeholder="Enter Your Password"
          value={formData.password}
          onChange={(text) => setFormData({ ...formData, password: text })}
        />
      </View>
      <SkinnyLink bold href={"/forgotPassword"} TextClassName="text-right">
        Forgot password?
      </SkinnyLink>
      <View className="flex-row gap-2 mt-5">
        <PrimaryButton className="flex-1" onPress={() => handleLogin({})}>
          Log In
        </PrimaryButton>
        {isBiometricSupported && (
          <TouchableOpacity
            className="border-2 rounded-xl"
            style={{ borderColor: Colors.light.primary }}
            onPress={handleBioMetricLogin}
          >
            <FingerPrint />
          </TouchableOpacity>
        )}
      </View>
      <View className="mt-8 flex-row items-center gap-4 justify-center">
        <View
          className="h-0.5 w-24"
          style={{ backgroundColor: Colors.light.border }}
        ></View>
        <Text className=" font-bold" style={{ color: Colors.light.border }}>
          Or
        </Text>
        <View
          className="h-0.5 w-24"
          style={{ backgroundColor: Colors.light.border }}
        ></View>
      </View>
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        className="border-2 rounded-xl py-4 w-full flex-row gap-2 justify-center mt-8"
        style={{ borderColor: Colors.light.border }}
      >
        <Image
          source={require("@/assets/images/iconImages/googleIcon.png")}
          className="h-6 w-6 object-contain"
        />
        <Text
          className="text-center font-bold dark:text-white"
          style={{ fontFamily: "Inter" }}
        >
          Login with Google
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
