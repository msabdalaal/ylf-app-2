import React, { useCallback, useContext, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "@/components/buttons/primary";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { get, post } from "@/hooks/axios";
import { save } from "@/hooks/storage";
import validator from "validator";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import { ApplicationContext } from "@/context";
import { useTheme } from "@/context/ThemeContext";
import InitialSignup from "@/components/signup/InitialSignup";
import IdUpload from "@/components/signup/IdUpload";
import PasswordSetup from "@/components/signup/PasswordSetup";
import UserInfo, { UserInfoRef } from "@/components/signup/UserInfo";
import dayjs from "dayjs";
import { useLoading } from "@/context/LoadingContext";
import AvatarUpload from "@/components/signup/AvatarUpload";
import * as DocumentPicker from "expo-document-picker";
import {
  validatePhoneNumber,
  validateAge,
  validateRequired,
  validateDateOfBirth,
  validateLanguage,
  validateSkill,
} from "@/utils/validation";

export interface formData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  id_front: string;
  id_back: string;
  avatar: string; // added
  phoneNumber: string;
  dateOfBirth: string | null;
  schoolType: "school" | "university" | "";
  college: string;
  school: string;
  experiences: string;
  jobTitle: string;
  age: string;
  address: string;
  languages: string[];
  skills: string[];
  government: string;
  nationalNumber: string;
  gender: "male" | "female" | "";
}

const SignUp = () => {
  const { updateState } = useContext(ApplicationContext);
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { hideLoading, showLoading } = useLoading();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<formData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_front: "",
    id_back: "",
    avatar: "",
    phoneNumber: "",
    dateOfBirth: null,
    schoolType: "",
    college: "",
    school: "",
    experiences: "",
    jobTitle: "",
    age: "",
    address: "",
    languages: [],
    skills: [],
    government: "",
    nationalNumber: "",
    gender: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      id_front: "",
      id_back: "",
      avatar: "",
      phoneNumber: "",
      dateOfBirth: null,
      schoolType: "",
      college: "",
      school: "",
      experiences: "",
      jobTitle: "",
      age: "",
      address: "",
      languages: [],
      skills: [],
      government: "",
      nationalNumber: "",
      gender: "",
    });
    setConfirmPassword("");
    setStep(1);
  };

  const getProfile = useCallback(async () => {
    await get("users/profile").then((res) => {
      const user = res.data.data;
      updateState("user", user);
    });
  }, []);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const pickImageAndFiles = async (side: "front" | "back") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      try {
        setFormData((prev) => ({
          ...prev,
          [`id_${side}`]: result.assets[0].uri,
        }));
      } catch (error) {
        console.error("Error picking file:", error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const redirect = Linking.createURL("/");
    await WebBrowser.openAuthSessionAsync(
      `https://mobile.ylf-eg.org/api/auth/google`,
      redirect
    );
  };
  const userInfoRef = useRef<UserInfoRef>(null);

  const handleContinue = async () => {
    switch (step) {
      case 1:
        if (!formData.name) return alert("Name cannot be empty");
        if (!validator.isEmail(formData.email))
          return alert("Email is not valid");

        await post("auth/isRegistered", {
          email: formData.email,
        })
          .then((res) => {
            setStep(2);
          })
          .catch((err) => {
            alert(err.response.data.message);
          });

        break;
      case 2:
        // require ID upload
        if (!formData.id_front || !formData.id_back)
          return alert("Please upload both sides of your ID");
        setStep(3);
        break;
      case 3:
        // require avatar upload
        if (!formData.avatar) return alert("Please upload a profile picture");
        setStep(4);
        break;
      case 4:
        if (formData.password !== confirmPassword)
          return alert("Passwords do not match");
        if (formData.password.length < 6)
          return alert("Password must be at least 6 characters");
        setStep(5);
        break;
      case 5:
        // require user info
        if (userInfoRef.current) {
          const isValid = userInfoRef.current.validate();
          if (!isValid) {
            return; // Don't proceed if validation fails
          }
        }
        await handleSignUp();
        break;
    }
  };

  const validateAllFields = () => {
    // Validate fields based on current step
    if (step === 1) {
      return true; // Basic info validation already done
    }

    if (step === 2) {
      // Validate user info fields
      const phoneError = validatePhoneNumber(formData.phoneNumber);
      const dobError = validateDateOfBirth(
        formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
      );
      const ageError = validateAge(formData.age);
      const jobTitleError = validateRequired(formData.jobTitle, "Job Title");
      const addressError = validateRequired(formData.address, "Address");
      const schoolError = formData.school ? "" : "Please select a school";
      const collegeError = validateRequired(formData.college, "College");
      const experiencesError = validateRequired(
        formData.experiences,
        "Work experience"
      );

      const languageError = validateLanguage(formData.languages);
      const skillError = validateSkill(formData.skills);

      return !(
        phoneError ||
        dobError ||
        ageError ||
        jobTitleError ||
        addressError ||
        schoolError ||
        collegeError ||
        experiencesError ||
        languageError ||
        skillError
      );
    }

    if (step === 3) {
      // Validate ID uploads
      return !!(formData.id_front && formData.id_back);
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateAllFields()) {
      // alert("Please fix the errors before submitting");
      return;
    }
    const realFormData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if ((key === "id_front" || key === "id_back") && val) {
        let type = "image/jpeg";
        let name = `${key}.jpg`;
        if (val.endsWith(".pdf")) {
          type = "application/pdf";
          name = `${key}.pdf`;
        } else if (val.match(/\.(png|jpeg|jpg)$/)) {
          // keep as image/jpeg
          name = `${key}.${val.split(".").pop()}`;
        }
        realFormData.append(key, {
          uri: val as string,
          type,
          name,
        } as any);
      } else if (key === "avatar" && val) {
        realFormData.append(key, {
          uri: val as string,
          type: "image/jpeg",
          name: `${key}.jpg`,
        } as any);
      } else if (key === "dateOfBirth") {
        realFormData.append(key, dayjs(val as string).toISOString() || "");
      } else if (key === "email") {
        realFormData.append(key, val.toLowerCase());
      } else if (Array.isArray(val)) {
        realFormData.append(key, (val as string[]).join(","));
      } else if (key !== "confirmPassword") {
        realFormData.append(key, String(val));
      }
    });

    try {
      setLoading(true);
      showLoading();
      const response = await fetch(
        "https://mobile.ylf-eg.org/api/auth/register",
        {
          method: "POST",
          body: realFormData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (data.access_token) await save("token", data.access_token);
        hideLoading();
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
      hideLoading();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InitialSignup formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <IdUpload
            setFormData={setFormData}
            formData={formData}
            pickImage={(side) => pickImageAndFiles(side)}
            onBack={() => setStep(1)}
            resetForm={resetForm}
          />
        );
      case 3:
        return (
          <AvatarUpload
            avatarUri={formData.avatar}
            pickAvatar={() => pickAvatar()}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <PasswordSetup
            formData={formData}
            setFormData={setFormData}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onBack={() => setStep(3)}
          />
        );
      case 5:
        return (
          <UserInfo
            ref={userInfoRef}
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(4)}
          />
        );
    }
  };

  return (
    <SafeAreaView
      className="flex-1 w-full"
      style={{ backgroundColor: Colors[theme].background }}
    >
      <View className="container flex-1">
        {renderStep()}
        <PrimaryButton onPress={handleContinue} className="my-6">
          {loading ? "Signing Up ..." : step === 5 ? "Sign Up" : "Continue"}
        </PrimaryButton>
        {step === 1 && (
          <>
            <View className="mt-8 flex-row items-center gap-4 justify-center">
              <View
                className="h-0.5 w-24"
                style={{ backgroundColor: Colors.light.border }}
              />
              <Text
                className="font-bold"
                style={{ color: Colors.light.border }}
              >
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
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
