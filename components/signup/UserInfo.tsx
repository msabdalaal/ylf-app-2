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
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import universities from "@/constants/universities";

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
          <View className="font-semibold">
            <Text
              className=" dark:text-white"
              style={{ fontFamily: "Poppins_Medium" }}
            >
              University
            </Text>
            <View className="border border-gray-300 dark:border-gray-600 rounded-lg">
              <Picker
                selectedValue={formData.university}
                onValueChange={(v: string) =>
                  setFormData((p) => ({ ...p, university: v }))
                }
                style={{
                  color: isDark ? "#E5E5E5" : Colors.light.text,
                }}
              >
                <Picker.Item label="Select University" value="" />
                {universities
                  .sort((a: string, b: string) => a.localeCompare(b))
                  .map((u) => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
              </Picker>
            </View>
          </View>
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
                <View className="flex-1">
                  <TextInputComponent
                    placeholder="Language"
                    value={lang}
                    onChange={(text) => {
                      const arr = [...formData.languages];
                      arr[index] = text;
                      setFormData((prev) => ({ ...prev, languages: arr }));
                    }}
                  />
                </View>
                <View className="flex-row items-center gap-2">
                  {index === formData.languages.length - 1 && lang.trim() && (
                    <TouchableOpacity
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          languages: [...prev.languages, ""],
                        }))
                      }
                      className="bg-primary py-1 px-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-lg bg-green-500 py-1 px-2 rounded-lg">
                        +
                      </Text>
                    </TouchableOpacity>
                  )}
                  {formData.languages.length > 1 && (
                    <TouchableOpacity
                      onPress={() => {
                        const arr = formData.languages.filter(
                          (_, i) => i !== index
                        );
                        setFormData((prev) => ({ ...prev, languages: arr }));
                      }}
                      className="bg-red-500 py-1 px-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-lg">×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
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
                <View className="flex-1">
                  <TextInputComponent
                    placeholder="Skill"
                    value={skill}
                    onChange={(text) => {
                      const arr = [...formData.skills];
                      arr[index] = text;
                      setFormData((prev) => ({ ...prev, skills: arr }));
                    }}
                  />
                </View>
                <View className="flex-row items-center gap-2">
                  {index === formData.skills.length - 1 && skill.trim() && (
                    <TouchableOpacity
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, ""],
                        }))
                      }
                      className="bg-primary py-1 px-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-lg bg-green-500 py-1 px-2 rounded-lg">
                        +
                      </Text>
                    </TouchableOpacity>
                  )}
                  {formData.skills.length > 1 && (
                    <TouchableOpacity
                      onPress={() => {
                        const arr = formData.skills.filter(
                          (_, i) => i !== index
                        );
                        setFormData((prev) => ({ ...prev, skills: arr }));
                      }}
                      className="bg-red-500 py-1 px-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-lg">×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
