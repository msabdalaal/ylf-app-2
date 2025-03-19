import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Dots from "@/assets/icons/dots";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import File from "@/assets/icons/file";
import { useTheme } from "@/context/ThemeContext";
import imageUrl from "@/utils/imageUrl";
import { User } from "@/constants/types";

type Props = {
  user: User;
  post: {
    body: string;
    likesCount: number;
    commentsCount: number;
    file: {
      name: string;
      link: string;
    };
  };
};

const FilePost = ({
  user = {
    name: "Profile Name",
    avatar: require("@/assets/images/avatar.png"),
  },
  post = {
    body: "The program follows three structured phases; Filtration, Development, Implementation",
    likesCount: 122,
    commentsCount: 10,
    file: {
      name: "Leadership Program Shortlisted.pdf",
      link: "",
    },
  },
}: Props) => {
  const { theme } = useTheme();

  return (
    <View
      className="rounded-[2rem] p-3 w-full"
      style={{ backgroundColor: Colors[theme ?? "light"].postBackground }}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
          <Image
            src={imageUrl(user.avatar?.path ?? "")}
            className="w-full h-full object-cover"
          />
        </View>
        <View className="flex-row flex-1 items-start justify-between">
          <View>
            <Text className="dark:text-white">{user.name}</Text>
            <Text className="text-xs dark:text-white">{user.name}</Text>
          </View>
          {/* <TouchableOpacity>
            <Dots />
          </TouchableOpacity> */}
        </View>
      </View>
      <Text className="mb-8 dark:text-white">{post.body}</Text>
      <View
        className="rounded-3xl"
        style={{ backgroundColor: Colors[theme ?? "light"].postFooter }}
      >
        <TouchableOpacity className="flex-row items-center gap-1.5">
          <View className="bg-[#085CA3] rounded-tl-3xl p-2">
            <File />
          </View>
          <Text className="text-white">{post.file.name}</Text>
        </TouchableOpacity>
        <View
          className="w-full py-3 px-6 rounded-b-3xl flex-row gap-2.5"
          style={{ backgroundColor: Colors[theme ?? "light"].postFooter }}
        >
          <TouchableOpacity className="flex-row items-center gap-1.5">
            <Comments />
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 20 }}
            >
              {post.commentsCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1.5">
            <Heart />
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 20 }}
            >
              {post.likesCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FilePost;
