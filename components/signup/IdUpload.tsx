import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BackButton from "@/components/buttons/backButton";
import Upload from "@/assets/icons/upload";
import CloseIcon from "@/assets/icons/close";
import { Colors } from "@/constants/Colors";
import { formData } from "@/app/(auth)/signup";

interface IdUploadProps {
  formData: formData;
  setFormData: (data: formData) => void;
  pickImage: (side: "front" | "back") => void;
  onBack: () => void;
  resetForm: () => void;
}

export default function IdUpload({
  formData,
  setFormData,
  pickImage,
  onBack,
  resetForm,
}: IdUploadProps) {
  return (
    <>
      <BackButton
        onClick={() => {
          resetForm();
          onBack();
        }}
        className="mt-5"
      />
      <Text
        className="mt-6 text-xl"
        style={{
          fontFamily: "Poppins_Medium",
          color: Colors.light.primary,
        }}
      >
        National ID Card or Birth Certificate
      </Text>
      <Text className="mt-4 dark:text-white" style={{ fontFamily: "Inter" }}>
        Scan your National ID or Birth Certificate to confirm your identity and
        gain access to our services.
      </Text>

      <View className="mt-7 space-y-4">
        <View>
          <Text className="mb-2 dark:text-white">Front Side</Text>
          {formData.id_front ? (
            <View className="flex-row justify-between items-center border border-gray-400 p-2 rounded-md">
              <Text className="dark:text-white">Front Id</Text>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, id_front: "" })}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => pickImage("front")}
              className="border border-dashed rounded-xl py-4 flex-row items-center justify-center"
              style={{
                backgroundColor: "#015CA41A",
                borderColor: "#015CA44D",
              }}
            >
              <Upload />
              <Text
                className="ml-2 dark:text-white"
                style={{ fontFamily: "Inter" }}
              >
                Upload Front
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-2">
          <Text className="mb-2 dark:text-white">Back Side</Text>
          {formData.id_back ? (
            <View className="flex-row justify-between items-center border border-gray-400 p-2 rounded-md">
              <Text className="dark:text-white">Back Id</Text>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, id_back: "" })}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => pickImage("back")}
              className="border border-dashed rounded-xl py-4 flex-row items-center justify-center"
              style={{
                backgroundColor: "#015CA41A",
                borderColor: "#015CA44D",
              }}
            >
              <Upload />
              <Text
                className="ml-2 dark:text-white"
                style={{ fontFamily: "Inter" }}
              >
                Upload Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}
