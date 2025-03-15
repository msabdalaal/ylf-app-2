import { useEffect, useState, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { save } from "@/hooks/storage";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { ApplicationContext } from "@/context";
import TextInputComponent from "@/components/inputs/textInput";
import DatePicker from "@/components/inputs/datePicker";
import PrimaryButton from "@/components/buttons/primary";
import dayjs from "dayjs";
import { patch } from "@/hooks/axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthRedirectScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { theme } = useTheme();
  const { updateState } = useContext(ApplicationContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    phoneNumber: string;
    dateOfBirth: string | null;
    education: string[];
    experiences: string[];
  }>({
    phoneNumber: "",
    dateOfBirth: null,
    education: [""],
    experiences: [""],
  });

  const handleComplete = async () => {
    if (!formData.phoneNumber) return alert("Phone number is required");
    if (!formData.dateOfBirth) return alert("Date of birth is required");
    if (!formData.education?.[0]) return alert("Education is required");
    if (!formData.experiences?.[0]) return alert("Work experience is required");

    try {
      setLoading(true);
      await patch("users/editProfile", formData,{},token as string);
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
        </View>

        <PrimaryButton onPress={handleComplete} className="mt-6">
          {loading ? "Completing Profile..." : "Complete Profile"}
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}
