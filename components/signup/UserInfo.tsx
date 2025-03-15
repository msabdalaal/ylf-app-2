import React from "react";
import { View } from "react-native";
import TextInputComponent from "@/components/inputs/textInput";
import DatePicker from "@/components/inputs/datePicker";
import BackButton from "@/components/buttons/backButton";
import dayjs from "dayjs";
import { formData } from "@/app/(auth)/signup";

export default function UserInfo({ 
  formData, 
  setFormData, 
  onBack 
}: { 
  formData: formData;
  setFormData: (data: any) => void;
  onBack: () => void;
}) {
  return (
    <>
      <BackButton onClick={onBack} />
      <View className="gap-4 mt-8">
        <TextInputComponent
          label="Phone Number"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(text) => setFormData({ ...formData, phoneNumber: text })}
        />
        <DatePicker
          value={formData.dateOfBirth ? dayjs(formData.dateOfBirth).toDate() : null}
          onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
          label="Date of Birth"
        />
        <TextInputComponent
          label="Education"
          placeholder="Education"
          value={formData.education?.[0]}
          onChange={(text) => setFormData({ ...formData, education: [text] })}
        />
        <TextInputComponent
          label="Work"
          placeholder="Work"
          value={formData.experiences?.[0]}
          onChange={(text) => setFormData({ ...formData, experiences: [text] })}
        />
      </View>
    </>
  );
}