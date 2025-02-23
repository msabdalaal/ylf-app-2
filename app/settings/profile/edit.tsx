import EditPencil from "@/assets/icons/editPencil";
import BackButton from "@/components/buttons/backButton";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { User } from "@/constants/types";
import { ApplicationContext } from "@/context";
import imageUrl from "@/utils/imageUrl";
import React, { useContext, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import DatePicker from "@/components/inputs/datePicker";
import PrimaryButton from "@/components/buttons/primary";
import SkinnyButton from "@/components/buttons/skinny";
import { patch, post } from "@/hooks/axios";
import * as ImagePicker from "expo-image-picker";
import { getValueFor } from "@/hooks/storage";

type Props = {};
const FormData = global.FormData;

export default function Edit({}: Props) {
  const {
    state: { user },
    updateState,
  } = useContext(ApplicationContext);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<User>({});

  const handleUpdateProfile = async () => {
    await patch("users/editProfile", edits)
      .then((res) => {
        setIsEditing(false);
        updateState("user", { ...user, ...edits });
        setEdits({});
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleUpdateAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const realFormData = new FormData();
        realFormData.append("avatar", {
          uri: result.assets[0].uri,
          type: "image/png",
          name: "avatar.png",
        } as any);
        const token = await getValueFor("token");
        const response = await fetch(
          "https://test.ylf-eg.org/api/users/uploadAvatar",
          {
            method: "POST",
            body: realFormData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          updateState("user", { ...user, avatar: "" });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error picking image:", error);
      }
    }
  };

  return (
    <SafeAreaView className="bg-white container flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row justify-between mb-6 mt-5">
          <View className="flex-row items-center gap-3">
            <BackButton />
            <Text
              style={{
                fontFamily: "Poppins_Medium",
                color: Colors.light.primary,
              }}
            >
              Profile
            </Text>
          </View>
          <SkinnyButton
            onPress={() => setIsEditing((prev) => !prev)}
            textClassName="underline"
          >
            {isEditing ? "Cancel" : "Edit"}
          </SkinnyButton>
        </View>
        <View className="justify-center items-center w-fit mx-auto">
          <View className="w-32 h-32 bg-[#80ADD1] rounded-full">
            <Image src={imageUrl(user?.avatar || "")} />
          </View>
          {isEditing && (
            <TouchableOpacity
              onPress={handleUpdateAvatar}
              className="h-10 w-10 rounded-full absolute bottom-0 right-0 flex justify-center items-center"
              style={{ backgroundColor: Colors.light.primary }}
            >
              <EditPencil />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TextInputComponent
            value={edits?.name || user?.name}
            disabled={!isEditing}
            label="Full Name"
            placeholder="Full name"
            onChange={(name) => setEdits((prev) => ({ ...prev, name }))}
          />
          <TextInputComponent
            value={edits?.email || user?.email}
            disabled={!isEditing}
            label="Email"
            placeholder="Email"
            onChange={(email) => setEdits((prev) => ({ ...prev, email }))}
            className="mt-4"
          />
          <TextInputComponent
            value={edits?.phoneNumber || user?.phoneNumber}
            disabled={!isEditing}
            label="Phone Number"
            placeholder="Phone Number"
            onChange={(phoneNumber) =>
              setEdits((prev) => ({ ...prev, phoneNumber }))
            }
            className="mt-4"
          />
          <View className="mt-4">
            <DatePicker
              value={
                edits?.dateOfBirth
                  ? dayjs(edits?.dateOfBirth).toDate()
                  : user?.dateOfBirth
                  ? dayjs(user?.dateOfBirth).toDate()
                  : null
              }
              onChange={(date) =>
                setEdits((prev) => ({ ...prev, dateOfBirth: date }))
              }
              label="Date of Birth"
              disabled={!isEditing}
            />
          </View>
          <TextInputComponent
            value={edits?.education?.[0] || user?.education?.[0]}
            disabled={!isEditing}
            label="Education"
            placeholder="Education"
            onChange={(education) =>
              setEdits((prev) => ({ ...prev, education: [education] }))
            }
            className="mt-4"
          />
          <TextInputComponent
            value={edits?.experiences?.[0] || user?.experiences?.[0]}
            disabled={!isEditing}
            label="Work"
            placeholder="Work"
            onChange={(work) =>
              setEdits((prev) => ({ ...prev, experiences: [work] }))
            }
            className="mt-4"
          />
          {isEditing && (
            <PrimaryButton className="mt-4" onPress={handleUpdateProfile}>
              Update Profile
            </PrimaryButton>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
