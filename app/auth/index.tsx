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
    languages: [""],
    skills: [""],
  });

  const [missingFields, setMissingFields] = useState<Record<string, boolean>>(
    {}
  );
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      try {
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
          languages: user.languages?.length ? user.languages : [""],
          skills: user.skills?.length ? user.skills : [""],
        });

        // If already complete, go to feed
        if (isProfileComplete(user)) {
          await save("token", token!.toString());
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
    const resp = await fetch("https://test.ylf-eg.org/api/users/uploadAvatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || "Avatar upload failed");
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

    const resp = await fetch("https://test.ylf-eg.org/api/users/uploadId", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!resp.ok) {
      const json = await resp.json();
      throw new Error(json.message || "ID upload failed");
    }
  };

  const handleComplete = async () => {
    // validate basic
    if (missingFields.avatar && !avatarUri)
      return Alert.alert("Error", "Please upload profile picture");
    if (missingFields.phoneNumber)
      return Alert.alert("Error", "Phone number is required");
    if (missingFields.dateOfBirth)
      return Alert.alert("Error", "Date of birth is required");
    if (missingFields.university)
      return Alert.alert("Error", "University is required");
    if (missingFields.college)
      return Alert.alert("Error", "College is required");
    if (missingFields.jobTitle)
      return Alert.alert("Error", "Job title is required");
    if (missingFields.age) return Alert.alert("Error", "Age is required");
    if (missingFields.address)
      return Alert.alert("Error", "Address is required");
    if (missingFields.languages)
      return Alert.alert("Error", "At least one language is required");
    if (missingFields.skills)
      return Alert.alert("Error", "At least one skill is required");
    if (
      (missingFields.idFront || missingFields.idBack) &&
      (!idFront || !idBack)
    )
      return Alert.alert("Error", "Please upload both sides of your ID");

    try {
      setLoading(true);

      // 1) patch profile fields
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
      router.replace("/feed");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to complete profile");
    } finally {
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
                <Text className="ml-2">Upload Profile Picture</Text>
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
            onChange={(v) => setFormData((p) => ({ ...p, phoneNumber: v }))}
          />
        )}
        {missingFields.dateOfBirth && (
          <DatePicker
            label="Date of Birth"
            value={
              formData.dateOfBirth ? dayjs(formData.dateOfBirth).toDate() : null
            }
            onChange={(d) => setFormData((p) => ({ ...p, dateOfBirth: d }))}
          />
        )}
        {missingFields.university && (
          <TextInputComponent
            label="University"
            placeholder="University"
            value={formData.university}
            onChange={(v) => setFormData((p) => ({ ...p, university: v }))}
            className="mt-4"
          />
        )}
        {missingFields.college && (
          <TextInputComponent
            label="College"
            placeholder="College"
            value={formData.college}
            onChange={(v) => setFormData((p) => ({ ...p, college: v }))}
            className="mt-4"
          />
        )}
        {missingFields.experiences && (
          <TextInputComponent
            label="Work Experience"
            placeholder="Experience"
            value={formData.experiences}
            onChange={(v) => setFormData((p) => ({ ...p, experiences: v }))}
            className="mt-4"
          />
        )}
        {missingFields.jobTitle && (
          <TextInputComponent
            label="Job Title"
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={(v) => setFormData((p) => ({ ...p, jobTitle: v }))}
            className="mt-4"
          />
        )}
        {missingFields.age && (
          <TextInputComponent
            label="Age"
            placeholder="Age"
            value={formData.age}
            onChange={(v) => setFormData((p) => ({ ...p, age: v }))}
            className="mt-4"
          />
        )}
        {missingFields.address && (
          <TextInputComponent
            label="Address"
            placeholder="Address"
            value={formData.address}
            onChange={(v) => setFormData((p) => ({ ...p, address: v }))}
            className="mt-4"
          />
        )}

        {/* ID Uploads */}
        {(missingFields.idFront || missingFields.idBack) && (
          <View className="mt-6">
            <Text
              className="mb-2"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              National ID
            </Text>
            {missingFields.idFront && (
              <View className="mb-4">
                <Text className="mb-1">Front Side</Text>
                {idFront ? (
                  <View className="flex-row justify-between items-center">
                    <Text>Selected</Text>
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
                    <Text className="ml-2">Upload Front</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {missingFields.idBack && (
              <View className="mb-4">
                <Text className="mb-1">Back Side</Text>
                {idBack ? (
                  <View className="flex-row justify-between items-center">
                    <Text>Selected</Text>
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
                    <Text className="ml-2">Upload Back</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* Languages */}
        {missingFields.languages && (
          <View className="mt-6">
            <Text
              className="mb-2"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              Languages
            </Text>
            {formData.languages.map((lng, ix) => (
              <View key={ix} className="flex-row items-center mb-2">
                <TextInputComponent
                  placeholder="Language"
                  value={lng}
                  onChange={(v) => {
                    const arr = [...formData.languages];
                    arr[ix] = v;
                    setFormData((p) => ({ ...p, languages: arr }));
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    const arr = formData.languages.filter((_, i) => i !== ix);
                    setFormData((p) => ({ ...p, languages: arr }));
                  }}
                >
                  <Text className="text-red-500 ml-2">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <PrimaryButton
              onPress={() =>
                setFormData((p) => ({ ...p, languages: [...p.languages, ""] }))
              }
              className="mb-6"
            >
              Add Language
            </PrimaryButton>
          </View>
        )}

        {/* Skills */}
        {missingFields.skills && (
          <View className="mt-6">
            <Text
              className="mb-2"
              style={{ fontFamily: "Poppins_Medium", fontSize: 16 }}
            >
              Skills
            </Text>
            {formData.skills.map((sk, ix) => (
              <View key={ix} className="flex-row items-center mb-2">
                <TextInputComponent
                  placeholder="Skill"
                  value={sk}
                  onChange={(v) => {
                    const arr = [...formData.skills];
                    arr[ix] = v;
                    setFormData((p) => ({ ...p, skills: arr }));
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    const arr = formData.skills.filter((_, i) => i !== ix);
                    setFormData((p) => ({ ...p, skills: arr }));
                  }}
                >
                  <Text className="text-red-500 ml-2">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <PrimaryButton
              onPress={() =>
                setFormData((p) => ({ ...p, skills: [...p.skills, ""] }))
              }
            >
              Add Skill
            </PrimaryButton>
          </View>
        )}

        {/* Complete button */}
        <PrimaryButton onPress={handleComplete} className="mt-8">
          {loading ? "Completing Profile..." : "Complete Profile"}
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}
