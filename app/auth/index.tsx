// screens/AuthRedirectScreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

import { useRouter, useLocalSearchParams } from "expo-router";
import { save } from "@/hooks/storage";
import { get, patch } from "@/hooks/axios";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { ApplicationContext } from "@/context";
import TextInputComponent from "@/components/inputs/textInput";
import DatePicker from "@/components/inputs/datePicker";
import PrimaryButton from "@/components/buttons/primary";
import Upload from "@/assets/icons/upload";
import dayjs from "dayjs";
import { isProfileComplete } from "@/utils/profileComplete";
import { useLoading } from "@/context/LoadingContext";
import universities from "@/constants/universities";

import {
  validatePhoneNumber,
  validateDateOfBirth,
  validateRequired,
  validateAge,
  validateLanguage,
  validateSkill,
  validateEmail,
  validatePassword,
  validateName,
} from "@/utils/validation";
import { AxiosError } from "axios";
import MultiSelect from "@/components/inputs/multiSelect";

type FormState = {
  phoneNumber: string;
  dateOfBirth: string | null;
  university: string;
  college: string;
  experiences: string;
  jobTitle: string;
  age: string;
  address: string;
  languages: string[];
  skills: string[];
};

export default function AuthRedirectScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { theme } = useTheme();
  const { updateState } = useContext(ApplicationContext);
  const { showLoading, hideLoading } = useLoading();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    phoneNumber: "",
    dateOfBirth: null,
    university: "",
    college: "",
    experiences: "",
    jobTitle: "",
    age: "",
    address: "",
    languages: [],
    skills: [],
  });

  const [missingFields, setMissingFields] = useState<Record<string, boolean>>(
    {}
  );
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateField = (field: string, value: any): string | null => {
    let error = null;

    switch (field) {
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
      case "dateOfBirth":
        error = validateDateOfBirth(value ? new Date(value) : null);
        break;
      case "age":
        error = validateAge(value);
        break;
      case "university":
      case "college":
      case "experiences":
      case "jobTitle":
      case "address":
        error = validateRequired(
          value,
          field.charAt(0).toUpperCase() + field.slice(1)
        );
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || "" }));
    return error;
  };

  const validateLanguageAt = (index: number, value: string): string | null => {
    const error = validateLanguage(value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [`language_${index}`]: error,
      }));
    } else {
      const newErrors = { ...errors };
      delete newErrors[`language_${index}`];
      setErrors(newErrors);
    }
    return error;
  };

  const validateSkillAt = (index: number, value: string): string | null => {
    const error = validateSkill(value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [`skill_${index}`]: error,
      }));
    } else {
      const newErrors = { ...errors };
      delete newErrors[`skill_${index}`];
      setErrors(newErrors);
    }
    return error;
  };

  // Update form data with validation
  const updateFormField = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleDateChange = (date: string | null) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
    validateField("dateOfBirth", date ? new Date(date) : null);
  };

  useEffect(() => {
    const checkProfile = async () => {
      try {
        showLoading();
        const res = await get("users/profile", {}, token as string);
        const user = res.data.data;
        updateState("user", user);

        // Build missing fields map
        const missing: Record<string, boolean> = {};
        if (!user.avatar?.path) missing.avatar = true;
        if (!user.phoneNumber) missing.phoneNumber = true;
        if (!user.dateOfBirth) missing.dateOfBirth = true;
        if (!user.university) missing.university = true;
        if (!user.college) missing.college = true;
        if (!user.experiences) missing.experiences = true;
        if (!user.jobTitle) missing.jobTitle = true;
        if (!user.age) missing.age = true;
        if (!user.address) missing.address = true;
        if (!user.languages?.[0]) missing.languages = true;
        if (!user.skills?.[0]) missing.skills = true;
        if (!user.idFront?.path) missing.idFront = true;
        if (!user.idBack?.path) missing.idBack = true;

        setMissingFields(missing);

        // Prefill form
        setFormData({
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth || null,
          university: user.university || "",
          college: user.college || "",
          experiences: user.experiences || "",
          jobTitle: user.jobTitle || "",
          age: user.age?.toString() || "",
          address: user.address || "",
          languages: user.languages?.length ? user.languages : [],
          skills: user.skills?.length ? user.skills : [],
        });

        // If already complete, go to feed
        if (isProfileComplete(user)) {
          await save("token", token!.toString());
          hideLoading();
          router.replace("/feed");
        }
      } catch (e) {
        console.error("Profile check error:", e);
        if (token) {
          await save("token", token.toString());
          router.replace("/feed");
        }
      } finally {
        setChecking(false);
        hideLoading();
      }
    };

    if (token) checkProfile();
    else {
      setChecking(false);
      router.replace("/login");
    }
  }, [token]);

  // pickAvatar or ID
  const pickImage = async (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled) setter(res.assets[0].uri);
  };

  // upload avatar
  const uploadAvatar = async () => {
    if (!avatarUri) return;
    const form = new FormData();
    form.append("avatar", {
      uri: avatarUri,
      type: "image/png",
      name: "avatar.png",
    } as any);
    showLoading();
    const resp = await fetch(
      "https://mobile.ylf-eg.org/api/users/uploadAvatar",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Avatar upload failed");
    hideLoading();
  };

  // upload IDs
  const uploadIds = async () => {
    const form = new FormData();
    form.append("id_front", {
      uri: idFront!,
      type: "image/jpeg",
      name: "id_front.jpg",
    } as any);
    form.append("id_back", {
      uri: idBack!,
      type: "image/jpeg",
      name: "id_back.jpg",
    } as any);

    showLoading();
    const resp = await fetch("https://mobile.ylf-eg.org/api/users/uploadId", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!resp.ok) {
      const json = await resp.json();
      throw new Error(json.message || "ID upload failed");
    }
    hideLoading();
  };

  const handleComplete = async () => {
    // Validate all fields first
    let hasErrors = false;

    // Validate basic fields
    if (missingFields.avatar && !avatarUri) {
      Alert.alert("Error", "Please upload profile picture");
      return;
    }

    if (missingFields.phoneNumber) {
      const phoneError = validateField("phoneNumber", formData.phoneNumber);
      if (phoneError) hasErrors = true;
    }

    if (missingFields.dateOfBirth) {
      const dobError = validateField(
        "dateOfBirth",
        formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
      );
      if (dobError) hasErrors = true;
    }

    if (missingFields.university) {
      const uniError = validateField("university", formData.university);
      if (uniError) hasErrors = true;
    }

    if (missingFields.college) {
      const collegeError = validateField("college", formData.college);
      if (collegeError) hasErrors = true;
    }

    if (missingFields.jobTitle) {
      const jobError = validateField("jobTitle", formData.jobTitle);
      if (jobError) hasErrors = true;
    }

    if (missingFields.age) {
      const ageError = validateField("age", formData.age);
      if (ageError) hasErrors = true;
    }

    if (missingFields.address) {
      const addressError = validateField("address", formData.address);
      if (addressError) hasErrors = true;
    }

    // Validate languages
    if (missingFields.languages) {
      let languageErrors = false;
      formData.languages.forEach((lang, index) => {
        const langError = validateLanguageAt(index, lang);
        if (langError) languageErrors = true;
      });

      if (formData.languages.length === 0 || !formData.languages[0]) {
        setErrors((prev) => ({
          ...prev,
          languages: "At least one language is required",
        }));
        languageErrors = true;
      }

      if (languageErrors) hasErrors = true;
    }

    // Validate skills
    if (missingFields.skills) {
      let skillErrors = false;
      formData.skills.forEach((skill, index) => {
        const skillError = validateSkillAt(index, skill);
        if (skillError) skillErrors = true;
      });

      if (formData.skills.length === 0 || !formData.skills[0]) {
        setErrors((prev) => ({
          ...prev,
          skills: "At least one skill is required",
        }));
        skillErrors = true;
      }

      if (skillErrors) hasErrors = true;
    }

    // Validate ID uploads
    if (
      (missingFields.idFront || missingFields.idBack) &&
      (!idFront || !idBack)
    ) {
      Alert.alert("Error", "Please upload both sides of your ID");
      return;
    }

    if (hasErrors) {
      Alert.alert(
        "Error",
        "Please fix the validation errors before continuing"
      );
      return;
    }

    try {
      setLoading(true);

      // 1) patch profile fields
      showLoading();
      await patch(
        "users/editProfile",
        {
          ...formData,
          age: Number(formData.age),
          dateOfBirth: formData.dateOfBirth,
        },
        {},
        token as string
      );

      // 2) upload avatar if provided
      if (avatarUri) await uploadAvatar();

      // 3) upload IDs if provided
      if (idFront && idBack) await uploadIds();

      await save("token", token as string);
      hideLoading();
      router.replace("/feed");
    } catch (e) {
      if (e instanceof AxiosError)
        Alert.alert(
          "Error",
          e.response?.data.message || "Failed to complete profile"
        );
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors[theme].primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors[theme].background }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          className="text-xl mb-4"
          style={{ fontFamily: "Poppins_Medium", color: Colors[theme].primary }}
        >
          Complete Your Profile
        </Text>

        {/* Avatar Upload */}
        {missingFields.avatar && (
          <View className="mb-6">
            <Text
              className="mb-2"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              Profile Picture
            </Text>
            {avatarUri ? (
              // <View className="flex-row justify-between items-center mb-2">
              //   <Text>Selected</Text>
              //   <TouchableOpacity onPress={() => setAvatarUri(null)}>
              //     <Text className="text-red-500">Remove</Text>
              //   </TouchableOpacity>
              // </View>
              <View className="items-center mb-2">
                <Image
                  source={{ uri: avatarUri }}
                  className="w-32 h-32 rounded-full"
                />
                <TouchableOpacity
                  onPress={() => setAvatarUri(null)}
                  className="mt-4"
                >
                  <Text style={{ color: Colors[theme ?? "light"].primary }}>
                    Change Photo
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => pickImage(setAvatarUri)}
                className="border border-dashed border-gray-400 rounded-lg p-4 flex-row items-center"
              >
                <Upload />
                <Text className="ml-2 dark:text-white">
                  Upload Profile Picture
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Other missing fields */}
        {missingFields.phoneNumber && (
          <TextInputComponent
            label="Phone Number"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(v) => updateFormField("phoneNumber", v)}
            error={errors.phoneNumber}
          />
        )}
        {missingFields.dateOfBirth && (
          <DatePicker
            label="Date of Birth"
            value={
              formData.dateOfBirth ? dayjs(formData.dateOfBirth).toDate() : null
            }
            onChange={(d) => handleDateChange(d)}
            error={errors.dateOfBirth}
          />
        )}
        {missingFields.university && (
          <View className="mt-4">
            <Text
              className="mb-2 dark:text-white"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              University
            </Text>
            <View className="border border-gray-300 dark:border-gray-600 rounded-lg">
              <Picker
                selectedValue={formData.university}
                onValueChange={(v: string) => updateFormField("university", v)}
                style={{
                  color: theme === "dark" ? "#E5E5E5" : Colors.light.text,
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
            {errors.university && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.university}
              </Text>
            )}
          </View>
        )}
        {missingFields.college && (
          <TextInputComponent
            label="College"
            placeholder="College"
            value={formData.college}
            onChange={(v) => updateFormField("college", v)}
            className="mt-4"
            error={errors.college}
          />
        )}
        {missingFields.experiences && (
          <TextInputComponent
            label="Work Experience"
            placeholder="Experience"
            value={formData.experiences}
            onChange={(v) => updateFormField("experiences", v)}
            className="mt-4"
            error={errors.experiences}
          />
        )}
        {missingFields.jobTitle && (
          <TextInputComponent
            label="Job Title"
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={(v) => updateFormField("jobTitle", v)}
            className="mt-4"
            error={errors.jobTitle}
          />
        )}
        {missingFields.age && (
          <TextInputComponent
            label="Age"
            placeholder="Age"
            value={formData.age}
            onChange={(v) => updateFormField("age", v)}
            className="mt-4"
            error={errors.age}
          />
        )}
        {missingFields.address && (
          <TextInputComponent
            label="Address"
            placeholder="Address"
            value={formData.address}
            onChange={(v) => updateFormField("address", v)}
            className="mt-4"
            error={errors.address}
          />
        )}

        {/* ID Uploads */}
        {(missingFields.idFront || missingFields.idBack) && (
          <View className="mt-6">
            <Text
              className="mb-2 dark:text-white"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              National ID
            </Text>
            {missingFields.idFront && (
              <View className="mb-4">
                <Text className="mb-1 dark:text-white">Front Side</Text>
                {idFront ? (
                  <View className="flex-row justify-between items-center">
                    <Text className="dark:text-white">Selected</Text>
                    <TouchableOpacity onPress={() => setIdFront(null)}>
                      <Text className="text-red-500">Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => pickImage(setIdFront)}
                    className="border border-dashed border-gray-400 rounded-lg p-4 flex-row items-center"
                  >
                    <Upload />
                    <Text className="ml-2 dark:text-white">Upload Front</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {missingFields.idBack && (
              <View className="mb-4">
                <Text className="mb-1 dark:text-white">Back Side</Text>
                {idBack ? (
                  <View className="flex-row justify-between items-center">
                    <Text className="dark:text-white">Selected</Text>
                    <TouchableOpacity onPress={() => setIdBack(null)}>
                      <Text className="text-red-500">Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => pickImage(setIdBack)}
                    className="border border-dashed border-gray-400 rounded-lg p-4 flex-row items-center"
                  >
                    <Upload />
                    <Text className="ml-2 dark:text-white">Upload Back</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* Languages */}
        {missingFields.languages && (
          <View className="mt-6">
            {/* {formData.languages.map((lng, ix) => (
              <View
                key={ix}
                className="relative flex-row items-center gap-2 mb-3"
              >
                <View className="flex-1">
                  <TextInputComponent
                    placeholder="Language"
                    value={lng}
                    onChange={(v) => {
                      const arr = [...formData.languages];
                      arr[ix] = v;
                      setFormData((p) => ({ ...p, languages: arr }));
                      validateLanguageAt(ix, v);
                    }}
                    error={errors[`language_${ix}`]}
                  />
                </View>
                <View className="flex-row items-center gap-2">
                  {ix === formData.languages.length - 1 && lng.trim() && (
                    <TouchableOpacity
                      onPress={() =>
                        setFormData((p) => ({
                          ...p,
                          languages: [...p.languages, ""],
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
                          (_, i) => i !== ix
                        );
                        setFormData((p) => ({ ...p, languages: arr }));
                      }}
                      className="bg-red-500 py-1 px-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-lg">×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))} */}

            <MultiSelect
              label="Language"
              options={["English", "Arabic", "French", "Spanish"]}
              value={formData.languages}
              onChange={(v) => {
                setFormData((p) => ({ ...p, languages: v }));
                let languageErrors = false;

                if (v.length === 0 || !v[0]) {
                  setErrors((prev) => ({
                    ...prev,
                    languages: "At least one language is required",
                  }));
                  languageErrors = true;
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    languages: "",
                  }));
                }
              }}
              placeholder="Language Selector"
            />
            {errors.languages && (
              <Text className="text-red-500 text-sm mb-2">
                {errors.languages}
              </Text>
            )}
          </View>
        )}

        {/* Skills */}
        {missingFields.skills && (
          <View className="mt-6">
            {/* <Text
              className="mb-2 dark:text-white"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              Skills
            </Text> */}
            {/* {formData.skills.map((sk, ix) => (
              <View
                key={ix}
                className="relative flex-row items-center gap-2 mb-3"
              >
                <View className="flex-1">
                  <TextInputComponent
                    placeholder="Skill"
                    value={sk}
                    onChange={(v) => {
                      const arr = [...formData.skills];
                      arr[ix] = v;
                      setFormData((p) => ({ ...p, skills: arr }));
                      validateSkillAt(ix, v);
                    }}
                    error={errors[`skill_${ix}`]}
                  />
                </View>
                <View className="flex-row items-center gap-2">
                  {ix === formData.skills.length - 1 && sk.trim() && (
                    <TouchableOpacity
                      onPress={() =>
                        setFormData((p) => ({
                          ...p,
                          skills: [...p.skills, ""],
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
                        const arr = formData.skills.filter((_, i) => i !== ix);
                        setFormData((p) => ({ ...p, skills: arr }));
                      }}
                      className="bg-red-500 py-1 px-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-lg">×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))} */}
            <MultiSelect
              label="Skills"
              options={[]} // Suggested options
              value={formData.skills}
              onChange={(v) => {
                setFormData((p) => ({ ...p, skills: v }));
                let skillErrors = false;

                if (v.length === 0 || !v[0]) {
                  setErrors((prev) => ({
                    ...prev,
                    skills: "At least one skill is required",
                  }));
                  skillErrors = true;
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    skills: "",
                  }));
                }
              }}
              placeholder="Skills"
              freeType={true} // Enable free typing
            />
            {errors.skills && (
              <Text className="text-red-500 text-sm mb-2">{errors.skills}</Text>
            )}
          </View>
        )}

        <PrimaryButton
          onPress={handleComplete}
          disabled={loading}
          className="mt-8"
        >
          Complete Profile
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}
