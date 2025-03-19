import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBarTabs from "@/components/topBar/tabs";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TextInputComponent from "@/components/inputs/textInput";
import PrimaryButton from "@/components/buttons/primary";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import BackButton from "@/components/buttons/backButton";
import { get, post } from "@/hooks/axios";
import { save } from "@/hooks/storage";
import validator from "validator";
import axios, { AxiosError } from "axios";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import Upload from "@/assets/icons/upload";
import CloseIcon from "@/assets/icons/close";
import { ApplicationContext } from "@/context";
import { useTheme } from "@/context/ThemeContext";
import InitialSignup from "@/components/signup/InitialSignup";
import IdUpload from "@/components/signup/IdUpload";
import PasswordSetup from "@/components/signup/PasswordSetup";
import UserInfo from "@/components/signup/UserInfo";
import dayjs from "dayjs";

export interface formData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  id_front: string;
  id_back: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  education: string[];
  experiences: string[];
  jobTitle: string;
  age: string;
  address: string;
  languages: string[];
  skills: string[];
}

const SignUp = () => {
  const { updateState } = useContext(ApplicationContext);
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<formData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_front: "",
    id_back: "",
    phoneNumber: "",
    dateOfBirth: null,
    education: [""],
    experiences: [""],
    jobTitle: "",
    age: "",
    address: "",
    languages: [""],
    skills: [""],
  });

  const getProfile = useCallback(async () => {
    await get("users/profile").then((res) => {
      const user = res.data.data;
      updateState("user", user);
    });
  }, []);

  const pickImage = async (side: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setFormData((prev) => ({
          ...prev,
          [`id_${side}`]: result.assets[0].uri,
        }));
      } catch (error) {
        console.error("Error picking image:", error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const redirect = Linking.createURL("/");
    await WebBrowser.openAuthSessionAsync(
      `https://test.ylf-eg.org/api/auth/google`,
      redirect
    );
  };

  const handleContinue = async () => {
    switch (step) {
      case 1:
        if (!formData.name) return alert("Name cannot be empty");
        if (!validator.isEmail(formData.email))
          return alert("Email is not valid");
        setStep(2);
        break;
      case 2:
        if (!formData.id_front || !formData.id_back)
          return alert("Please upload both sides of your ID");
        setStep(3);
        break;
      case 3:
        if (formData.password !== confirmPassword)
          return alert("Passwords do not match");
        if (formData.password.length < 6)
          return alert("Password must be at least 6 characters");
        setStep(4);
        break;
      case 4:
        if (!formData.phoneNumber) return alert("Phone number is required");
        if (!formData.dateOfBirth) return alert("Date of birth is required");
        if (!formData.education?.[0]) return alert("Education is required");
        if (!formData.experiences?.[0])
          return alert("Work experience is required");
        if (!formData.jobTitle) return alert("Job title is required");
        if (!formData.age) return alert("Age is required");
        if (!formData.address) return alert("Address is required");
        if (!formData.languages?.[0])
          return alert("At least one language is required");
        if (!formData.skills?.[0])
          return alert("At least one skill is required");
        await handleSignUp();
        break;
    }
  };

  const handleSignUp = async () => {
    const realFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "id_front" || key === "id_back") {
        realFormData.append(key, {
          uri: formData[key],
          type: "image/jpeg",
          name: `${key}.jpg`,
        } as any);
      } else if (key === "dateOfBirth") {
        realFormData.append(
          key,
          dayjs(formData[key] ?? "").toISOString() || ""
        );
      } else if (
        ["education", "experiences", "languages", "skills"].includes(key)
      ) {
        realFormData.append(
          key,
          JSON.stringify(formData[key as keyof typeof formData])
        );
      } else if (key !== "confirmPassword") {
        realFormData.append(
          key,
          String(formData[key as keyof typeof formData] ?? "")
        );
      }
    });

    try {
      setLoading(true);
      const response = await fetch(
        "https://test.ylf-eg.org/api/auth/register",
        {
          method: "POST",
          body: realFormData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (data.access_token) await save("token", data.access_token);
        await getProfile();
        router.replace("/feed");
      } else {
        alert(data.message || "An error occurred during registration");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InitialSignup formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <IdUpload
            formData={formData}
            setFormData={setFormData}
            pickImage={pickImage}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <PasswordSetup
            formData={formData}
            setFormData={setFormData}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <UserInfo
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(3)}
          />
        );
    }
  };

  return (
    <SafeAreaView
      className="flex-1 w-full container"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      {renderStep()}
      <PrimaryButton onPress={handleContinue} className="my-6">
        {loading ? "Signing Up ..." : step === 4 ? "Sign Up" : "Continue"}
      </PrimaryButton>
      {step === 1 && (
        <>
          <View className="mt-8 flex-row items-center gap-4 justify-center">
            <View
              className="h-0.5 w-24"
              style={{ backgroundColor: Colors.light.border }}
            />
            <Text className="font-bold" style={{ color: Colors.light.border }}>
              Or
            </Text>
            <View
              className="h-0.5 w-24"
              style={{ backgroundColor: Colors.light.border }}
            />
          </View>
          <TouchableOpacity
            className="border-2 rounded-xl py-4 w-full flex-row gap-2 justify-center mt-8"
            style={{ borderColor: Colors.light.border }}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require("@/assets/images/iconImages/googleIcon.png")}
              className="h-6 w-6 object-contain"
            />
            <Text
              className="text-center font-bold dark:text-white"
              style={{ fontFamily: "Inter" }}
            >
              Sign Up with Google
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default SignUp;
