import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import TextInputComponent from "@/components/inputs/textInput";
import DatePicker from "@/components/inputs/datePicker";
import BackButton from "@/components/buttons/backButton";
import dayjs from "dayjs";
import { formData } from "@/app/(auth)/signup";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../buttons/primary";

interface UserInfoProps {
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
  onBack: () => void;
}

export default function UserInfo({
  formData,
  setFormData,
  onBack,
}: UserInfoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const addArrayField = (field: "languages" | "skills") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field: "languages" | "skills", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayField = (
    field: "languages" | "skills",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "" : "bg-white"}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton onClick={onBack} />
        <View className="space-y-4">
          <TextInputComponent
            label="Phone Number"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, phoneNumber: text }))
            }
          />
          <DatePicker
            value={
              formData.dateOfBirth ? dayjs(formData.dateOfBirth).toDate() : null
            }
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, dateOfBirth: date }))
            }
            label="Date of Birth"
          />
          <TextInputComponent
            label="Job Title"
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, jobTitle: text }))
            }
          />
          <TextInputComponent
            label="Age"
            placeholder="Age"
            value={formData.age}
            onChange={(text) => setFormData((prev) => ({ ...prev, age: text }))}
          />
          <TextInputComponent
            label="Address"
            placeholder="Address"
            value={formData.address}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, address: text }))
            }
          />
          <TextInputComponent
            label="University"
            placeholder="University"
            value={formData.university}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, university: text }))
            }
          />
          <TextInputComponent
            label="College"
            placeholder="College"
            value={formData.college}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, college: text }))
            }
          />
          <TextInputComponent
            label="Work"
            placeholder="Work"
            value={formData.experiences}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, experiences: text }))
            }
          />

          <View className="mt-6">
            <Text
              className={`text-lg font-medium mb-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Languages
            </Text>
            {formData.languages.map((lang, index) => (
              <View
                key={index}
                className="relative flex-row items-center gap-2 mb-3"
              >
                <TextInputComponent
                  placeholder="Language"
                  value={lang}
                  onChange={(text) =>
                    updateArrayField("languages", index, text)
                  }
                />
                <TouchableOpacity
                  onPress={() => removeArrayField("languages", index)}
                  className="bg-red-500 py-1 px-2 rounded-lg active:bg-red-600 absolute right-0 -top-1"
                >
                  <Text className="text-white font-bold text-lg">X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <PrimaryButton
              onPress={() => addArrayField("languages")}
              disabled={
                !formData.languages[formData.languages.length - 1].trim()
              }
              className="bg-primary px-3 py-1 rounded-lg active:bg-primary/80"
            >
              <Text className="text-white font-medium">Add New</Text>
            </PrimaryButton>
          </View>

          <View className="mt-6">
            <Text
              className={`text-lg font-medium mb-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Skills
            </Text>
            {formData.skills.map((skill, index) => (
              <View
                key={index}
                className="relative flex-row items-center gap-2 mb-3"
              >
                <TextInputComponent
                  placeholder="Skill"
                  value={skill}
                  onChange={(text) => updateArrayField("skills", index, text)}
                />
                <TouchableOpacity
                  onPress={() => removeArrayField("skills", index)}
                  className="bg-red-500 py-1 px-2 rounded-lg active:bg-red-600 absolute right-0 -top-1"
                >
                  <Text className="text-white font-bold text-lg">X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <PrimaryButton
              onPress={() => addArrayField("skills")}
              disabled={!formData.skills[formData.skills.length - 1].trim()}
              className="bg-primary px-3 py-1 rounded-lg active:bg-primary/80"
            >
              <Text className="text-white font-medium">Add New</Text>
            </PrimaryButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
