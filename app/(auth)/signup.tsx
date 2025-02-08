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
import { AxiosError } from "axios";

const SignUp = () => {
  const [emailIsUnique, setEmailIsUnique] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const handleSignUp = async () => {
    if (emailIsUnique) {
      if (
        formData.password !== "" &&
        formData.name !== "" &&
        formData.email !== ""
      ) {
        if (formData.password !== confirmPassword)
          return alert("Passwords do not match");
        if (!validator.isEmail(formData.email))
          return alert("Email is not valid");
        if (validator.isStrongPassword(formData.password, { minLength: 6 }))
          return alert("Password has to be at least 6 characters long");
        try {
          const result = await post("auth/register", formData);
          console.log(result);
          if (result.status === 201) {
            await save("token", result.data.access_token);
            router.replace("/feed");
          } else {
            console.log(result);
            alert(result.data.message);
          }
        } catch (error) {
          if (error instanceof AxiosError) alert(error.response?.data.message);
        }
      }
    } else {
      setEmailIsUnique(true);
    }
  };
  return (
    <SafeAreaView className="flex-1 w-full container bg-white">
      {emailIsUnique ? (
        <>
          <BackButton onClick={() => setEmailIsUnique(false)} />
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
        Continue
      </PrimaryButton>
      {/* {emailIsUnique ? null : (
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
      )} */}
    </SafeAreaView>
  );
};

export default SignUp;
