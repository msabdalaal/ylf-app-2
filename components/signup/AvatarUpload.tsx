import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Upload from "@/assets/icons/upload";
import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  avatarUri: string;
  pickAvatar: () => void;
  onBack: () => void;
};

const AvatarUpload: React.FC<Props> = ({ avatarUri, pickAvatar, onBack }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors[theme ?? "light"].background }}
    >
      <BackButton onClick={onBack} />
      <View className="p-6">
        <Text className="text-lg font-medium mb-4 dark:text-white">
          Upload Profile Picture
        </Text>

        {avatarUri ? (
          <View className="items-center mb-6">
            <Image
              source={{ uri: avatarUri }}
              className="w-32 h-32 rounded-full"
            />
            <TouchableOpacity onPress={pickAvatar} className="mt-4 ">
              <Text style={{ color: Colors[theme ?? "light"].primary }}>
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickAvatar}
            className="border border-dashed border-gray-400 rounded-lg p-8 items-center"
            style={{ borderColor: Colors[theme ?? "light"].border }}
          >
            <Upload />
            <Text
              className="mt-2 dark:text-white"
            >
              Tap to select a profile picture
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AvatarUpload;
