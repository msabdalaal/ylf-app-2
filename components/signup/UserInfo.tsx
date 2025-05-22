import React, { useState } from "react";
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
import {
  validatePhoneNumber,
  validateAge,
  validateRequired,
  validateDateOfBirth,
  validateLanguage,
  validateSkill,
} from "@/utils/validation";
import MultiSelect from "../inputs/multiSelect";

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

  // Add state for validation errors
  const [errors, setErrors] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    jobTitle: "",
    age: "",
    address: "",
    university: "",
    college: "",
    experiences: "",
    languages: [""],
    skills: [""],
  });

  // Validate a specific field
  const validateField = (field: string, value: any) => {
    let error = "";

    switch (field) {
      case "phoneNumber":
        error = validatePhoneNumber(value) || "";
        break;
      case "dateOfBirth":
        error = validateDateOfBirth(value) || "";
        break;
      case "age":
        error = validateAge(value) || "";
        break;
      case "jobTitle":
      case "address":
      case "college":
      case "experiences":
        error =
          validateRequired(
            value,
            field.charAt(0).toUpperCase() + field.slice(1)
          ) || "";
        break;
      case "university":
        error = value ? "" : "Please select a university";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Validate language at specific index
  const validateLanguageAt = (index: number, value: string) => {
    const error = validateLanguage(value) || "";
    setErrors((prev) => {
      const newLanguageErrors = [...prev.languages];
      newLanguageErrors[index] = error;
      return { ...prev, languages: newLanguageErrors };
    });
    return error;
  };

  // Validate skill at specific index
  const validateSkillAt = (index: number, value: string) => {
    const error = validateSkill(value) || "";
    setErrors((prev) => {
      const newSkillErrors = [...prev.skills];
      newSkillErrors[index] = error;
      return { ...prev, skills: newSkillErrors };
    });
    return error;
  };

  // Update array field with validation
  const updateArrayField = (
    field: "languages" | "skills",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));

    if (field === "languages") {
      validateLanguageAt(index, value);
    } else if (field === "skills") {
      validateSkillAt(index, value);
    }
  };

  // Handle phone number change with validation
  const handlePhoneChange = (text: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: text }));
    validateField("phoneNumber", text);
  };

  // Handle date of birth change with validation
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date ? date.toISOString() : null,
    }));
    validateField("dateOfBirth", date);
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
            onChange={handlePhoneChange}
            error={errors.phoneNumber}
          />
          <DatePicker
            value={
              formData.dateOfBirth ? dayjs(formData.dateOfBirth).toDate() : null
            }
            onChange={(date: string) =>
              handleDateChange(date ? new Date(date) : null)
            }
            label="Date of Birth"
            error={errors.dateOfBirth}
          />
          <TextInputComponent
            label="Job Title"
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={(text) => {
              setFormData((prev) => ({ ...prev, jobTitle: text }));
              validateField("jobTitle", text);
            }}
            error={errors.jobTitle}
          />
          <TextInputComponent
            label="Age"
            placeholder="Age"
            value={formData.age}
            onChange={(text) => {
              setFormData((prev) => ({ ...prev, age: text }));
              validateField("age", text);
            }}
            error={errors.age}
          />
          <TextInputComponent
            label="Address"
            placeholder="Address"
            value={formData.address}
            onChange={(text) => {
              setFormData((prev) => ({ ...prev, address: text }));
              validateField("address", text);
            }}
            error={errors.address}
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
                onValueChange={(v: string) => {
                  setFormData((p) => ({ ...p, university: v }));
                  validateField("university", v);
                }}
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
            {errors.university ? (
              <Text
                className="text-red-500 text-sm mt-1 ml-1"
                style={{ fontFamily: "Inter" }}
              >
                {errors.university}
              </Text>
            ) : null}
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
            <MultiSelect
              label="Language"
              options={["English", "Arabic", "French", "Spanish"]}
              value={formData.languages}
              onChange={(v) => {
                setFormData((p) => ({ ...p, languages: v }));
              }}
              placeholder="Language Selector"
              freeType
            />
          </View>

          <View className="mt-3 mb-5">
            <MultiSelect
              label="Skills"
              value={formData.skills}
              onChange={(v) => {
                setFormData((p) => ({ ...p, skills: v }));
              }}
              placeholder="Skills"
              freeType={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
