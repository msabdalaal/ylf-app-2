import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import TextInputComponent from "@/components/inputs/textInput";
import PrimaryButton from "@/components/buttons/primary";
import { Colors } from "@/constants/Colors";
import { post } from "@/hooks/axios";
import { save } from "@/hooks/storage";
import validator from "validator";
import { AxiosError } from "axios";
import FingerPrint from "@/assets/icons/fingerPrint";
import TopBarTabs from "@/components/topBar/tabs";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const router = useRouter();

  // Check if biometrics are available
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

  // Handle Email/Password Login
  const handleLogin = async ({
    email = formData.email,
    password = formData.password,
  }: {
    email?: string;
    password?: string;
  }) => {
    if (!validator.isEmail(email)) return alert("Invalid Email");
    if (password === "") return alert("Password cannot be empty");

    try {
      const res = await post(
        "auth/login",
        email && password ? { email, password } : formData
      );
      const token = res.data.access_token;

      await save("token", token);

      await SecureStore.setItemAsync("email", email);
      await SecureStore.setItemAsync("password", password);

      router.replace("/feed");
    } catch (error) {
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

      // Log in using stored credentials
      handleLogin({ email: storedEmail, password: storedPassword });
    } else {
      alert("Biometric authentication failed.");
    }
  };

  const handleLoginWithGoogle = async () => {
    // Create the redirect URI using your custom scheme
    const redirectUri = Linking.createURL("auth"); // e.g., myapp://auth

    const authUrl = `https://test.ylf-eg.org/api/auth/google`;

    // Open the backend URL in a browser session
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success") {
      const { queryParams } = Linking.parse(result.url);
      console.log(queryParams);

      if (queryParams && queryParams.token) {
        // Save the token and navigate to the app’s main feed
        if (typeof queryParams.token === "string") {
          await save("token", queryParams.token);
          router.replace("/feed");
        } else {
          Alert.alert("Authentication Error", "Invalid token received.");
        }
        // For example, using Expo Router:
      } else {
        Alert.alert("Authentication Error", "No token received.");
      }
    } else {
      Alert.alert("Authentication cancelled or failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 w-full container bg-white">
      <TopBarTabs
        links={[
          { name: "Log In", link: "/login" },
          { name: "Sign Up", link: "/signup" },
        ]}
      />
      <View className="mt-16 gap-4">
        <TextInputComponent
          label="Your Email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInputComponent
          label="Password"
          secure={true}
          placeholder="**************"
          value={formData.password}
          onChange={(text) => setFormData({ ...formData, password: text })}
        />
      </View>
      {/* <SkinnyLink bold href={"/forgotPassword"} TextClassName="text-right">
        Forgot password?
      </SkinnyLink> */}
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
        onPress={handleLoginWithGoogle}
        className="border-2 rounded-xl py-4 w-full flex-row gap-2 justify-center mt-8"
        style={{ borderColor: Colors.light.border }}
      >
        <Image
          source={require("@/assets/images/iconImages/googleIcon.png")}
          className="h-6 w-6 object-contain"
        />
        <Text className="text-center font-bold" style={{ fontFamily: "Inter" }}>
          Login with Google
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
