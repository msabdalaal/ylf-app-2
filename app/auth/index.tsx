import { useEffect, useState, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
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
    education: string[];
    experiences: string[];
    jobTitle: string;
    age: string;
    address: string;
    languages: string[];
    skills: string[];
  }>({
    phoneNumber: "",
    dateOfBirth: null,
    education: [""],
    experiences: [""],
    jobTitle: "",
    age: "",
    address: "",
    languages: [""],
    skills: [""],
  });

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await get("users/profile", {}, token as string);
        const user = response.data.data;
        updateState("user", user);

        setFormData({
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth || null,
          education: user.education?.length ? user.education : [""],
          experiences: user.experiences?.length ? user.experiences : [""],
          jobTitle: user.jobTitle || "",
          age: user.age || "",
          address: user.address || "",
          languages: user.languages?.length ? user.languages : [""],
          skills: user.skills?.length ? user.skills : [""],
        });

        if (isProfileComplete(user)) {
          await save("token", token!.toString());
          router.replace("/feed");
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      } finally {
        setChecking(false);
      }
    };

    if (token) {
      checkProfile();
    }
  }, [token]);

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

  const handleComplete = async () => {
    if (!formData.phoneNumber) return alert("Phone number is required");
    if (!formData.dateOfBirth) return alert("Date of birth is required");
    if (!formData.education?.[0]) return alert("Education is required");
    if (!formData.experiences?.[0]) return alert("Work experience is required");
    if (!formData.jobTitle) return alert("Job title is required");
    if (!formData.age) return alert("Age is required");
    if (!formData.address) return alert("Address is required");
    if (!formData.languages?.[0])
      return alert("At least one language is required");
    if (!formData.skills?.[0]) return alert("At least one skill is required");

    try {
      setLoading(true);
      await patch("users/editProfile", formData, {}, token as string);
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
          Please provide the following information to complete your registration
        </Text>

        <View className="gap-4">
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
            label="Education"
            placeholder="Education"
            value={formData.education[0]}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, education: [text] }))
            }
          />
          <TextInputComponent
            label="Work"
            placeholder="Work"
            value={formData.experiences[0]}
            onChange={(text) =>
              setFormData((prev) => ({ ...prev, experiences: [text] }))
            }
          />

          {/* Languages Section */}
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

          {/* Skills Section */}
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
        </View>

        <PrimaryButton onPress={handleComplete} className="mt-6">
          {loading ? "Completing Profile..." : "Complete Profile"}
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}
