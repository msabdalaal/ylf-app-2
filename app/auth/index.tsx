import { useEffect, useState, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from "react-native";
import { save } from "@/hooks/storage";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { ApplicationContext } from "@/context";
import TextInputComponent from "@/components/inputs/textInput";
import DatePicker from "@/components/inputs/datePicker";
import PrimaryButton from "@/components/buttons/primary";
import dayjs from "dayjs";
import { get, patch } from "@/hooks/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { isProfileComplete } from "@/utils/profileComplete";
import * as ImagePicker from "expo-image-picker";
import Upload from "@/assets/icons/upload";

export default function AuthRedirectScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { theme } = useTheme();
  const { updateState } = useContext(ApplicationContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState<{
    phoneNumber: string;
    dateOfBirth: string | null;
    university: string;
    college: string;
    experiences: string[];
    jobTitle: string;
    age: string;
    address: string;
    languages: string[];
    skills: string[];
  }>({
    phoneNumber: "",
    dateOfBirth: null,
    university: "",
    college: "",
    experiences: [""],
    jobTitle: "",
    age: "",
    address: "",
    languages: [""],
    skills: [""],
  });
  const [idFront, setIdFront] = useState("");
  const [idBack, setIdBack] = useState("");
  const [uploadingId, setUploadingId] = useState(false);
  const [missingFields, setMissingFields] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await get("users/profile", {}, token as string);
        const user = response.data.data;
        updateState("user", user);

        // Create an object to track missing fields
        const missing: Record<string, boolean> = {};
        if (!user?.phoneNumber) missing.phoneNumber = true;
        if (!user?.dateOfBirth) missing.dateOfBirth = true;
        if (!user?.college) missing.college = true;
        if (!user?.university) missing.university = true;
        if (!user?.experiences?.[0]) missing.experiences = true;
        if (!user?.jobTitle) missing.jobTitle = true;
        if (!user?.age) missing.age = true;
        if (!user?.address) missing.address = true;
        if (!user?.languages?.[0]) missing.languages = true;
        if (!user?.skills?.[0]) missing.skills = true;
        if (!user?.idFront?.path) missing.idFront = true;
        if (!user?.idBack?.path) missing.idBack = true;

        // Check if there are any missing fields
        const hasMissingFields = Object.keys(missing).length > 0;

        setMissingFields(missing);
        console.log("Missing fields:", missing);

        setFormData({
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth || null,
          college: user.college ? user.college : "",
          university: user.university ? user.university : "",
          experiences: user.experiences?.length ? user.experiences : [""],
          jobTitle: user.jobTitle || "",
          age: user.age?.toString() || "",
          address: user.address || "",
          languages: user.languages?.length ? user.languages : [""],
          skills: user.skills?.length ? user.skills : [""],
        });

        // If profile is complete or no missing fields, redirect to feed
        if (isProfileComplete(user) || !hasMissingFields) {
          await save("token", token!.toString());
          router.replace("/feed");
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        // On error, still save token and redirect to feed
        if (token) {
          await save("token", token.toString());
          router.replace("/feed");
        }
      } finally {
        setChecking(false);
      }
    };

    if (token) {
      checkProfile();
    } else {
      // If no token, don't leave in checking state
      setChecking(false);
      router.replace("/login");
    }
  }, [token, router, updateState]);

  if (checking) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator
          size="large"
          color={Colors[theme ?? "light"].primary}
        />
      </View>
    );
  }

  const pickImage = async (side: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        if (side === "front") {
          setIdFront(result.assets[0].uri);
        } else {
          setIdBack(result.assets[0].uri);
        }
      } catch (error) {
        console.error("Error picking image:", error);
      }
    }
  };

  // Function to upload ID images
  const handleUploadIds = async () => {
    if (!idFront || !idBack) {
      Alert.alert("Error", "Please upload both sides of your ID");
      return;
    }

    try {
      setUploadingId(true);
      const realFormData = new FormData();

      realFormData.append("id_front", {
        uri: idFront,
        type: "image/jpeg",
        name: "id_front.jpg",
      } as any);

      realFormData.append("id_back", {
        uri: idBack,
        type: "image/jpeg",
        name: "id_back.jpg",
      } as any);

      const response = await fetch(
        "https://test.ylf-eg.org/api/users/uploadId",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: realFormData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Alert.alert("Success", "ID uploaded successfully");
      } else {
        // Alert.alert("Error", data.message || "Failed to upload ID");
        console.log(data);
      }
    } catch (error) {
      console.error("Error uploading ID:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    } finally {
      setUploadingId(false);
    }
  };

  const handleComplete = async () => {
    if (!formData.phoneNumber) return alert("Phone number is required");
    if (!formData.dateOfBirth) return alert("Date of birth is required");
    if (!formData.university) return alert("University is required");
    if (!formData.college) return alert("College is required");
    if (!formData.experiences?.[0]) return alert("Work experience is required");
    if (!formData.jobTitle) return alert("Job title is required");
    if (!formData.age) return alert("Age is required");
    if (!formData.address) return alert("Address is required");
    if (!formData.languages?.[0])
      return alert("At least one language is required");
    if (!formData.skills?.[0]) return alert("At least one skill is required");
    
    // Check if ID uploads are required but missing
    if ((missingFields.idFront || missingFields.idBack) && (!idFront || !idBack)) {
      return Alert.alert("Error", "Please upload both sides of your ID");
    }
    
    try {
      setLoading(true);
      await patch("users/editProfile", formData, {}, token as string);

      // If IDs are uploaded, handle that separately
      if (idFront && idBack) {
        await handleUploadIds();
      }

      if (token) {
        await save("token", token.toString());
        router.replace("/feed");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  // Add this useEffect to check form validity whenever form data or IDs change
  // useEffect(() => {
  //   const checkFormValidity = () => {
  //     // Check if all required fields are filled
  //     const isBasicInfoComplete = !!(
  //       formData.phoneNumber &&
  //       formData.dateOfBirth &&
  //       formData.university &&
  //       formData.college &&
  //       formData.experiences?.[0] &&
  //       formData.jobTitle &&
  //       formData.age &&
  //       formData.address &&
  //       formData.languages?.[0] &&
  //       formData.skills?.[0]
  //     );

  //     // Check if ID photos are required and provided
  //     const areIdsRequired = missingFields.idFront || missingFields.idBack;
  //     const areIdsProvided = !!(idFront && idBack);

  //     // Form is valid if basic info is complete AND (IDs are not required OR IDs are provided)
  //     const valid = isBasicInfoComplete && (!areIdsRequired || areIdsProvided);
  //     setIsFormValid(valid);
  //   };

  //   checkFormValidity();
  // }, [formData, idFront, idBack, missingFields]);

  return (
    <SafeAreaView
      className="flex-1 container"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Text
          className="text-xl mt-6"
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors[theme ?? "light"].primary,
          }}
        >
          Complete Your Profile
        </Text>
        <Text
          className="mt-2 mb-6"
          style={{
            fontFamily: "Inter",
            color: theme === "dark" ? "#9CA3AF" : Colors.light.text,
          }}
        >
          Please provide the missing information to complete your registration
        </Text>

        <View className="gap-4">
          {missingFields.phoneNumber && (
            <TextInputComponent
              label="Phone Number"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
            />
          )}

          {missingFields.dateOfBirth && (
            <DatePicker
              value={
                formData.dateOfBirth
                  ? dayjs(formData.dateOfBirth).toDate()
                  : null
              }
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, dateOfBirth: date }))
              }
              label="Date of Birth"
            />
          )}

          {missingFields.jobTitle && (
            <TextInputComponent
              label="Job Title"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, jobTitle: text }))
              }
            />
          )}

          {missingFields.age && (
            <TextInputComponent
              label="Age"
              placeholder="Age"
              value={formData.age}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, age: text }))
              }
            />
          )}

          {missingFields.address && (
            <TextInputComponent
              label="Address"
              placeholder="Address"
              value={formData.address}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
            />
          )}

          {missingFields.university && (
            <TextInputComponent
              label="University"
              placeholder="University"
              value={formData.university}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, university: text }))
              }
            />
          )}

          {missingFields.college && (
            <TextInputComponent
              label="College"
              placeholder="College"
              value={formData.college}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, college: text }))
              }
            />
          )}

          {missingFields.experiences && (
            <TextInputComponent
              label="Work"
              placeholder="Work"
              value={formData.experiences[0]}
              onChange={(text) =>
                setFormData((prev) => ({ ...prev, experiences: [text] }))
              }
            />
          )}

          {/* ID Upload Section - only show if missing */}
          {(missingFields.idFront || missingFields.idBack) && (
            <View className="mt-6">
              <Text
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                National ID Card
              </Text>
              <Text
                className="mb-4 dark:text-gray-300"
                style={{ fontFamily: "Inter" }}
              >
                Please upload both sides of your National ID card
              </Text>

              {/* Front ID Upload */}
              {missingFields.idFront && (
                <View className="mb-4">
                  <Text className="mb-2 dark:text-white">Front Side</Text>
                  {!idFront ? (
                    <TouchableOpacity
                      onPress={() => pickImage("front")}
                      className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center"
                    >
                      <Upload />
                      <Text className="mt-2 dark:text-white">
                        Upload Front Side
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="border border-gray-300 rounded-lg p-2 flex-row justify-between items-center">
                      <Text className="dark:text-white">Front ID Uploaded</Text>
                      <TouchableOpacity onPress={() => setIdFront("")}>
                        <Text className="text-red-500">Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Back ID Upload */}
              {missingFields.idBack && (
                <View className="mb-4">
                  <Text className="mb-2 dark:text-white">Back Side</Text>
                  {!idBack ? (
                    <TouchableOpacity
                      onPress={() => pickImage("back")}
                      className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center"
                    >
                      <Upload />
                      <Text className="mt-2 dark:text-white">
                        Upload Back Side
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="border border-gray-300 rounded-lg p-2 flex-row justify-between items-center">
                      <Text className="dark:text-white">Back ID Uploaded</Text>
                      <TouchableOpacity onPress={() => setIdBack("")}>
                        <Text className="text-red-500">Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Languages Section - only show if missing */}
          {missingFields.languages && (
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
                className="bg-primary px-3 py-1 rounded-lg active:bg-primary/80"
              >
                Add Language
              </PrimaryButton>
            </View>
          )}

          {/* Skills Section - only show if missing */}
          {missingFields.skills && (
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
                className="bg-primary px-3 py-1 rounded-lg active:bg-primary/80"
              >
                Add Skill
              </PrimaryButton>
            </View>
          )}
        </View>

        <PrimaryButton
          onPress={handleComplete}
          className={`mt-6`}
        >
          {loading || uploadingId
            ? "Completing Profile..."
            : "Complete Profile"}
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}
