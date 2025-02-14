import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBarTabs from "@/components/topBar/tabs";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TextInputComponent from "@/components/inputs/textInput";
import PrimaryButton from "@/components/buttons/primary";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import BackButton from "@/components/buttons/backButton";
import { post } from "@/hooks/axios";
import { save } from "@/hooks/storage";
import validator from "validator";
import axios, { AxiosError } from "axios";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import Upload from "@/assets/icons/upload";
import CloseIcon from "@/assets/icons/close";

const SignUp = () => {
  const [emailIsUnique, setEmailIsUnique] = useState(false);
  const [isIdUploaded, setIsIdUploaded] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    id_front: string;
    id_back: string;
  }>({
    name: "",
    email: "",
    password: "",
    id_front: "",
    id_back: "",
  });
  const FormData = global.FormData;
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignUp = async () => {
    if (isIdUploaded) {
      if (
        formData.password !== "" &&
        formData.name !== "" &&
        formData.email !== ""
      ) {
        if (formData.password !== confirmPassword)
          return alert("Passwords do not match");
        if (!validator.isEmail(formData.email))
          return alert("Email is not valid");
        if (formData.password.length < 6)
          return alert("Password has to be at least 6 characters long");

        const realFormData = new FormData();
        realFormData.append("name", formData.name);
        realFormData.append("email", formData.email);
        realFormData.append("password", formData.password);
        realFormData.append("id_front", {
          uri: formData.id_front,
          type: "image/png",
          name: "id_front.png",
        } as any);
        realFormData.append("id_back", {
          uri: formData.id_back,
          type: "image/png",
          name: "id_back.png",
        } as any);

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
      }
    } else if (emailIsUnique) {
      if (formData.id_front && formData.id_back) {
        setEmailIsUnique(false);
        setIsIdUploaded(true);
      }
    } else {
      setEmailIsUnique(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const redirect = Linking.createURL("/");

    await WebBrowser.openAuthSessionAsync(
      `https://test.ylf-eg.org/api/auth/google`,
      redirect
    );
  };

  const pickImage = async (side: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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

  return (
    <SafeAreaView className="flex-1 w-full container bg-white">
      {emailIsUnique ? (
        <>
          <BackButton
            onClick={() => setEmailIsUnique(false)}
            className="mt-5"
          />
          <Text
            className="mt-6 text-xl"
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors.light.primary,
            }}
          >
            National ID Card
          </Text>
          <Text className="mt-4" style={{ fontFamily: "Inter" }}>
            Scan your National ID to confirm your identity and gain access to
            our services.
          </Text>

          <TouchableOpacity
            onPress={() => pickImage(formData.id_front ? "back" : "front")}
            disabled={formData.id_front !== "" && formData.id_back !== ""}
          >
            <View
              className="border mt-7 border-dashed rounded-xl py-6 w-full gap-2 justify-center items-center"
              style={{
                backgroundColor: "#015CA41A",
                borderColor: "#015CA44D",
              }}
            >
              <Upload />
              <Text
                className="text-center font-bold mt-5"
                style={{ fontFamily: "Inter" }}
              >
                Browse {formData.id_front ? "Back" : "Front"} Side of ID
              </Text>
            </View>
          </TouchableOpacity>
          <View className="mt-5">
            <Text className="mb-2">Uploaded</Text>
            {formData.id_front && (
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, id_front: "" })}
                className="border border-gray-400 p-2 rounded-md flex-row justify-between items-center"
              >
                <Text>Front Id</Text>
                <CloseIcon />
              </TouchableOpacity>
            )}
            {formData.id_back && (
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, id_back: "" })}
                className="border border-gray-400 p-2 mt-3 rounded-md flex-row justify-between items-center"
              >
                <Text>Back Id</Text>
                <CloseIcon />
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : isIdUploaded ? (
        <>
          <BackButton onClick={() => setIsIdUploaded(false)} />
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
            In order to keep your account safe you need to create a strong
            password.
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
      ) : (
        <>
          <TopBarTabs
            links={[
              { name: "Log In", link: "/login" },
              { name: "Sign Up", link: "/signup" },
            ]}
          />
          <View className="mt-16 gap-4">
            {/* <TextInputComponent label="First Name" placeholder="John" /> */}
            <TextInputComponent
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInputComponent
              label="Your Email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(text) => setFormData({ ...formData, email: text })}
            />
          </View>
        </>
      )}
      <PrimaryButton onPress={handleSignUp} className="mt-6">
        {loading ? "Signing Up ..." : isIdUploaded ? "Sign Up" : "Continue"}
      </PrimaryButton>
      {emailIsUnique || isIdUploaded ? null : (
        <>
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
            className="border-2 rounded-xl py-4 w-full flex-row gap-2 justify-center mt-8"
            style={{ borderColor: Colors.light.border }}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require("@/assets/images/iconImages/googleIcon.png")}
              className="h-6 w-6 object-contain"
            />
            <Text
              className="text-center font-bold"
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
