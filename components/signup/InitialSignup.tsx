import React from "react";
import { View } from "react-native";
import TextInputComponent from "@/components/inputs/textInput";
import TopBarTabs from "@/components/topBar/tabs";
import { formData } from "@/app/(auth)/signup";

interface InitialSignupProps {
  formData: formData;
  setFormData: (data: formData) => void;
}

export default function InitialSignup({
  formData,
  setFormData,
}: InitialSignupProps) {
  return (
    <>
      <TopBarTabs
        links={[
          { name: "Log In", link: "/login" },
          { name: "Sign Up", link: "/signup" },
        ]}
      />
      <View className="mt-16 gap-4">
        <TextInputComponent
          label="Full Name"
          placeholder="Enter Full Name"
          value={formData.name}
          onChange={(text) => setFormData({ ...formData, name: text })}
          maxLength={30}
        />
        <TextInputComponent
          label="Email Address"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={(text) => setFormData({ ...formData, email: text })}
        />
      </View>
    </>
  );
}
