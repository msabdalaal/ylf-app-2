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
export interface UserInfoRef {
  validate: () => boolean;
}
const UserInfo = React.forwardRef<UserInfoRef, UserInfoProps>(
  ({ formData, setFormData, onBack }, ref) => {
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
      languages: "",
      skills: "",
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
        case "languages":
          error = validateLanguage(value) || "";
          break;
        case "skills":
          error = validateSkill(value) || "";
          break;
        default:
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));
      return error;
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

    const validateForm = (): boolean => {
      let isValid = true;

      // Validate all fields
      const phoneError = validatePhoneNumber(formData.phoneNumber);
      const dobError = validateDateOfBirth(
        formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
      );
      const jobTitleError = validateRequired(formData.jobTitle, "Job Title");
      const ageError = validateAge(formData.age);
      const addressError = validateRequired(formData.address, "Address");
      const universityError = validateRequired(formData.university, "University");
      const collegeError = validateRequired(formData.college, "College");
      const experiencesError = validateRequired(
        formData.experiences,
        "Work experience"
      );

      // Validate languages
      const languageError =
        formData.languages.length === 0 ? "Language cannot be empty" : null;

      // Validate skills
      const skillError =
        formData.skills.length === 0 ? "Skill cannot be empty" : null;

      // Update error states
      setErrors((prev) => ({
        ...prev,
        phoneNumber: phoneError || "",
        dateOfBirth: dobError || "",
        jobTitle: jobTitleError || "",
        age: ageError || "",
        address: addressError || "",
        university: universityError || "",
        college: collegeError || "",
        experiences: experiencesError || "",
        languages: languageError || "",
        skills: skillError || "",
      }));

      // Check if any errors exist
      isValid = !(
        phoneError ||
        dobError ||
        jobTitleError ||
        ageError ||
        addressError ||
        universityError ||
        collegeError ||
        experiencesError ||
        languageError ||
        skillError
      );
console.log(languageError)
      return isValid;
    };
    // Expose the validate function via ref
    React.useImperativeHandle(ref, () => ({
      validate: validateForm,
    }));

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
                formData.dateOfBirth
                  ? dayjs(formData.dateOfBirth).toDate()
                  : null
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
              onChange={(text) => {
                setFormData((prev) => ({ ...prev, college: text }));
                validateField("college", text);
              }}
              error={errors.college}
            />
            <TextInputComponent
              label="Work"
              placeholder="Work"
              value={formData.experiences}
              onChange={(text) => {
                setFormData((prev) => ({ ...prev, experiences: text }));
                validateField("experiences", text);
              }}
              error={errors.experiences}
            />

            <View className="mt-6">
              <MultiSelect
                label="Language"
                options={["English", "Arabic", "French", "Spanish"]}
                value={formData.languages}
                onChange={(v) => {
                  setFormData((p) => ({ ...p, languages: v }));
                  validateField("languages", v);
                }}
                placeholder="Language Selector"
                freeType
              />
              {errors.languages && (
                <Text
                  className="text-red-500 text-sm mt-1 ml-1"
                  style={{ fontFamily: "Inter" }}
                >
                  {errors.languages}
                </Text>
              )}
            </View>

            <View className="mt-3 mb-5">
              <MultiSelect
                label="Skills"
                value={formData.skills}
                onChange={(v) => {
                  setFormData((p) => ({ ...p, skills: v }));
                  validateField("skills", v);
                }}
                placeholder="Skills"
                freeType={true}
              />
              {errors.skills && (
                <Text
                  className="text-red-500 text-sm mt-1 ml-1"
                  style={{ fontFamily: "Inter" }}
                >
                  {errors.skills}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
);
export default UserInfo;
