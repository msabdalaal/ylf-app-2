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
import { useTheme } from "@/context/ThemeContext";

import PrimaryButton from "@/components/buttons/primary";
import SkinnyButton from "@/components/buttons/skinny";
import { patch } from "@/hooks/axios";
import * as ImagePicker from "expo-image-picker";
import { getValueFor } from "@/hooks/storage";
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native";
import { useLoading } from "@/context/LoadingContext";
import MultiSelect from "@/components/inputs/multiSelect";

type Props = {};
const FormData = global.FormData;

export default function Edit({}: Props) {
  const {
    state: { user },
    updateState,
  } = useContext(ApplicationContext);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<User>({});
  const { theme } = useTheme();
  const { showLoading, hideLoading } = useLoading();

  const handleUpdateProfile = async () => {
    showLoading();
    await patch("users/editProfile", edits)
      .then((res) => {
        setIsEditing(false);
        updateState("user", { ...user, ...edits });
        setEdits({});

        // Show success message
        Alert.alert(
          "Success",
          "Profile updated successfully!",
          [{ text: "OK" }],
          { cancelable: false }
        );
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
      .finally(() => {
        hideLoading();
      });
  };
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [tempAvatarUri, setTempAvatarUri] = useState<string | null>(null);

  const handleUpdateAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      try {
        // Set loading state and temporary image
        setIsAvatarUploading(true);
        setTempAvatarUri(result.assets[0].uri);

        const realFormData = new FormData();
        realFormData.append("avatar", {
          uri: result.assets[0].uri,
          type: "image/png",
          name: "avatar.png",
        } as any);
        const token = await getValueFor("token");
        const response = await fetch(
          "https://mobile.ylf-eg.org/api/users/uploadAvatar",
          {
            method: "POST",
            body: realFormData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          updateState("user", {
            ...user,
            avatar: { path: data.filePath },
          });
          Alert.alert(
            "Success",
            "Profile picture updated successfully!",
            [{ text: "OK" }],
            { cancelable: false }
          );
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert(
          "Error",
          "Failed to upload profile picture. Please try again.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } finally {
        setIsAvatarUploading(false);
        setTempAvatarUri(null);
      }
    }
  };

  return (
    <SafeAreaView
      className="bg-white container flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row justify-between mb-6 mt-5">
          <View className="flex-row items-center gap-3">
            <BackButton disabled={isAvatarUploading} />
            <Text
              style={{
                fontFamily: "Poppins_Medium",
                color: Colors[theme ?? "light"].primary,
              }}
            >
              Profile
            </Text>
          </View>
          <SkinnyButton
            onPress={() => setIsEditing((prev) => !prev)}
            textClassName="underline"
            disabled={isAvatarUploading}
          >
            {isEditing ? "Cancel" : "Edit"}
          </SkinnyButton>
        </View>
        <View className="justify-center items-center w-fit mx-auto">
          <View className="w-32 h-32 bg-[#80ADD1] rounded-full overflow-hidden">
            {isAvatarUploading ? (
              tempAvatarUri ? (
                <View className="relative w-full h-full">
                  <Image
                    source={{ uri: tempAvatarUri }}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <ActivityIndicator
                    size="large"
                    color={Colors.light.primary}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={
                      {
                        // transform: [{ translateX: 38 }, { translateY: -15 }],
                      }
                    }
                  />
                </View>
              ) : (
                <ActivityIndicator
                  size="large"
                  color={Colors.light.primary}
                  className="flex-1 justify-center items-center"
                />
              )
            ) : (
              <Image
                src={imageUrl(user?.avatar?.path || "")}
                className="w-full h-full object-cover"
              />
            )}
          </View>
          {isEditing && !isAvatarUploading && (
            <TouchableOpacity
              onPress={handleUpdateAvatar}
              className="h-10 w-10 rounded-full absolute bottom-0 right-0 flex justify-center items-center"
              style={{ backgroundColor: Colors.light.primary }}
            >
              <EditPencil />
            </TouchableOpacity>
          )}
        </View>

        {/* Disable the entire form while uploading avatar */}
        <View
          pointerEvents={isAvatarUploading ? "none" : "auto"}
          style={{ opacity: isAvatarUploading ? 0.7 : 1 }}
        >
          {/* Existing fields */}
          <TextInputComponent
            value={edits?.name || user?.name}
            disabled={!isEditing || isAvatarUploading}
            label="Full Name"
            placeholder="Full name"
            onChange={(name) => setEdits((prev) => ({ ...prev, name }))}
          />

          {/* ... other existing fields ... */}

          {/* New fields */}
          <TextInputComponent
            value={edits?.jobTitle || user?.jobTitle}
            disabled={!isEditing}
            label="Job Title"
            placeholder="Job Title"
            onChange={(jobTitle) => setEdits((prev) => ({ ...prev, jobTitle }))}
            className="mt-4"
          />

          <TextInputComponent
            value={edits?.age || user?.age?.toString()}
            disabled={!isEditing}
            label="Age"
            placeholder="Age"
            onChange={(age) => setEdits((prev) => ({ ...prev, age }))}
            className="mt-4"
          />

          <TextInputComponent
            value={edits?.address || user?.address}
            disabled={!isEditing}
            label="Address"
            placeholder="Address"
            onChange={(address) => setEdits((prev) => ({ ...prev, address }))}
            className="mt-4"
          />

          <TextInputComponent
            value={edits?.university || user?.university}
            disabled={!isEditing}
            label="University"
            placeholder="University"
            onChange={(university) =>
              setEdits((prev) => ({ ...prev, university }))
            }
            className="mt-4"
          />

          <TextInputComponent
            value={edits?.college || user?.college}
            disabled={!isEditing}
            label="College"
            placeholder="College"
            onChange={(college) => setEdits((prev) => ({ ...prev, college }))}
            className="mt-4"
          />

          {/* Languages Section */}
          {isEditing && (
            <View className="mt-6">
              <MultiSelect
                label="Language"
                options={["English", "Arabic", "French", "Spanish"]}
                value={edits?.languages || user?.languages || []}
                onChange={(v) => {
                  setEdits((prev) => ({ ...prev, languages: v }));
                }}
                placeholder="Language Selector"
                freeType
              />
            </View>
          )}

          {/* Skills Section */}
          {isEditing && (
            <View className="mt-6">
              <MultiSelect
                label="Skills"
                value={edits?.skills || user?.skills || []}
                onChange={(v) => {
                  setEdits((prev) => ({ ...prev, skills: v }));
                }}
                placeholder="Skills"
                freeType={true} // Enable free typing
              />
            </View>
          )}

          {/* Display languages and skills in non-editing mode */}
          {!isEditing && user?.languages && user.languages.length > 0 && (
            <View className="mt-4">
              <Text
                className="dark:text-white"
                style={{
                  fontFamily: "Poppins_Medium",
                }}
              >
                Languages
              </Text>
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
              >
                {user.languages.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: theme == "dark" ? "#374151" : "#F3F4F6",
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: theme == "dark" ? "white" : "black",
                        fontFamily: "Inter",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!isEditing && user?.skills && user.skills.length > 0 && (
            <View className="mt-4">
              <Text
                className="dark:text-white"
                style={{
                  fontFamily: "Poppins_Medium",
                }}
              >
                Skills
              </Text>
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
              >
                {user.skills.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: theme == "dark" ? "#374151" : "#F3F4F6",
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: theme == "dark" ? "white" : "black",
                        fontFamily: "Inter",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {isEditing && (
            <PrimaryButton className="mt-4 mb-8" onPress={handleUpdateProfile}>
              Update Profile
            </PrimaryButton>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
