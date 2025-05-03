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
        National ID Card
      </Text>
      <Text className="mt-4 dark:text-white" style={{ fontFamily: "Inter" }}>
        Scan your National ID to confirm your identity and gain access to our
        services.
      </Text>

      <TouchableOpacity
        onPress={() => pickImage(formData.id_front ? "back" : "front")}
        disabled={formData.id_front !== "" && formData.id_back !== ""}
      >
        <View
          className="border mt-7 border-dashed rounded-xl py-6 w-full gap-2 justify-center items-center "
          style={{
            backgroundColor: "#015CA41A",
            borderColor: "#015CA44D",
          }}
        >
          <Upload />
          <Text
            className="text-center font-bold mt-5 dark:text-white"
            style={{ fontFamily: "Inter" }}
          >
            Browse {formData.id_front ? "Back" : "Front"} Side of ID
          </Text>
        </View>
      </TouchableOpacity>
      <View className="mt-5">
        <Text className="mb-2 dark:text-white">Uploaded:</Text>
        {formData.id_front && (
          <TouchableOpacity
            onPress={() => setFormData({ ...formData, id_front: "" })}
            className="border border-gray-400 p-2 rounded-md flex-row justify-between items-center"
          >
            <Text className="dark:text-white">Front Id</Text>
            <CloseIcon />
          </TouchableOpacity>
        )}
        {formData.id_back && (
          <TouchableOpacity
            onPress={() => setFormData({ ...formData, id_back: "" })}
            className="border border-gray-400 p-2 mt-3 rounded-md flex-row justify-between items-center"
          >
            <Text className="dark:text-white">Back Id</Text>
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
