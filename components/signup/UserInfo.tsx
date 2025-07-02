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
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import universities, { governorates } from "@/constants/universities";
import {
  validatePhoneNumber,
  validateAge,
  validateRequired,
  validateDateOfBirth,
  validateLanguage,
  validateSkill,
} from "@/utils/validation";
import MultiSelect from "../inputs/multiSelect";
import { useTheme } from "@/context/ThemeContext";

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
    const { theme } = useTheme();
    // Add state for validation errors
    const [errors, setErrors] = useState({
      phoneNumber: "",
      dateOfBirth: "",
      jobTitle: "",
      age: "",
      address: "",
      schoolType: "",
      school: "",
      college: "",
      experiences: "",
      languages: "",
      skills: "",
      government: "",
      nationalNumber: "",
      gender: "",
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
        case "schoolType":
          error = value ? "" : "Please select a school type";
          break;
        case "school":
          if (formData.schoolType === "school") {
            error = value ? "" : "School name is required";
          } else if (formData.schoolType === "university") {
            error = value ? "" : "University is required";
          } else {
            error = "";
          }
          break;
        case "languages":
          error = validateLanguage(value) || "";
          break;
        case "skills":
          error = validateSkill(value) || "";
          break;
        case "government":
          error = value ? "" : "Please select a government";
          break;
        case "nationalNumber":
          if (!value) error = "National number is required";
          else if (value.length < 5)
            error = "National number must be at least 5 characters";
          else if (value.length > 14)
            error = "National number must be at most 14 characters";
          break;
        case "gender":
          error = value ? "" : "Please select a gender";
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
      const schoolTypeError = validateRequired(
        formData.schoolType,
        "School Type"
      );
      let universityError = "";
      if (formData.schoolType === "school") {
        universityError = formData.school ? "" : "School name is required";
      } else if (formData.schoolType === "university") {
        universityError = formData.school ? "" : "University is required";
      }
      const collegeError =
        formData.schoolType === "university"
          ? validateRequired(formData.college, "College")
          : null;
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

      // Validate government
      const governmentError = validateField("government", formData.government);
      const nationalNumberError = validateField(
        "nationalNumber",
        formData.nationalNumber
      );
      const genderError = validateField("gender", formData.gender);

      // Update error states
      setErrors((prev) => ({
        ...prev,
        phoneNumber: phoneError || "",
        dateOfBirth: dobError || "",
        jobTitle: jobTitleError || "",
        age: ageError || "",
        address: addressError || "",
        schoolType: schoolTypeError || "",
        school: universityError || "",
        college: collegeError || "",
        experiences: experiencesError || "",
        languages: languageError || "",
        skills: skillError || "",
        government: governmentError || "",
        nationalNumber: nationalNumberError || "",
        gender: genderError || "",
      }));

      // Check if any errors exist
      isValid = !(
        phoneError ||
        dobError ||
        jobTitleError ||
        ageError ||
        addressError ||
        schoolTypeError ||
        universityError ||
        collegeError ||
        experiencesError ||
        languageError ||
        skillError ||
        governmentError ||
        nationalNumberError ||
        genderError
      );
      console.log(languageError);
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
          <View className="gap-4 mt-4">
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
                className="mb-2 font-semibold"
                style={{
                  color: theme === "dark" ? "#E5E5E5" : Colors.light.text,
                }}
              >
                School Type
              </Text>
              <View className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <Picker
                  selectedValue={formData.schoolType}
                  onValueChange={(v: string) => {
                    setFormData((p) => ({
                      ...p,
                      schoolType: v as "school" | "university",
                    }));
                    validateField("schoolType", v);
                  }}
                  style={{
                    color: isDark ? "#E5E5E5" : Colors.light.text,
                  }}
                >
                  <Picker.Item label="Select School Type" value="" />
                  <Picker.Item label="School" value="school" />
                  <Picker.Item label="University" value="university" />
                </Picker>
              </View>
              {errors.schoolType ? (
                <Text
                  className="text-red-500 text-sm mt-1 ml-1"
                  style={{ fontFamily: "Inter" }}
                >
                  {errors.schoolType}
                </Text>
              ) : null}
            </View>

            <View className="font-semibold">
              <Text
                className="mb-2 font-semibold"
                style={{
                  color: theme === "dark" ? "#E5E5E5" : Colors.light.text,
                }}
              >
                {formData.schoolType === "school"
                  ? "School Name"
                  : "University"}
              </Text>
              {formData.schoolType === "school" ? (
                <TextInputComponent
                  placeholder="School Name"
                  value={formData.school}
                  onChange={(text) => {
                    setFormData((prev) => ({ ...prev, school: text }));
                    validateField("school", text);
                  }}
                  error={errors.school}
                />
              ) : (
                <View>
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg">
                    <Picker
                      selectedValue={formData.school}
                      onValueChange={(v: string) => {
                        setFormData((p) => ({ ...p, school: v }));
                        validateField("school", v);
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
                  {errors.school ? (
                    <Text
                      className="text-red-500 text-sm mt-1 ml-1"
                      style={{ fontFamily: "Inter" }}
                    >
                      {errors.school}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>

            {formData.schoolType === "university" && (
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
            )}
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
            <TextInputComponent
              label="National ID Number or Passport ID Number"
              placeholder="National ID Number or Passport ID Number"
              value={formData.nationalNumber}
              onChange={(text) => {
                setFormData((prev) => ({ ...prev, nationalNumber: text }));
                validateField("nationalNumber", text);
              }}
              error={errors.nationalNumber}
            />
            <View className="font-semibold">
              <Text
                className="mb-2 font-semibold"
                style={{
                  color: theme === "dark" ? "#E5E5E5" : Colors.light.text,
                }}
              >
                Government
              </Text>
              <View className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <Picker
                  selectedValue={formData.government}
                  onValueChange={(v: string) => {
                    setFormData((p) => ({ ...p, government: v }));
                    validateField("government", v);
                  }}
                  style={{ color: isDark ? "#E5E5E5" : Colors.light.text }}
                >
                  <Picker.Item label="Select Government" value="" />
                  {governorates.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                  ))}
                </Picker>
              </View>
              {errors.government ? (
                <Text
                  className="text-red-500 text-sm mt-1 ml-1"
                  style={{ fontFamily: "Inter" }}
                >
                  {errors.government}
                </Text>
              ) : null}
            </View>
            <View className="font-semibold">
              <Text
                className="mb-2 font-semibold"
                style={{
                  color: theme === "dark" ? "#E5E5E5" : Colors.light.text,
                }}
              >
                Gender
              </Text>
              <View className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(v: string) => {
                    setFormData((p) => ({
                      ...p,
                      gender: v as "male" | "female",
                    }));
                    validateField("gender", v);
                  }}
                  style={{ color: isDark ? "#E5E5E5" : Colors.light.text }}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>
              {errors.gender ? (
                <Text
                  className="text-red-500 text-sm mt-1 ml-1"
                  style={{ fontFamily: "Inter" }}
                >
                  {errors.gender}
                </Text>
              ) : null}
            </View>
            <View className="">
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

            <View className="mb-5">
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
