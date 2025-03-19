import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import Play from "@/assets/icons/play";
import { Post } from "@/constants/types";
import imageUrl from "@/utils/imageUrl";
import VideoScreen from "../videoPlayer";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  handleLike: (id: string) => void;
  post: Post;
  showAll?: boolean;
  className?: string;
};

const VideoPost = ({
  post = {
    id: "",
    content:
      "The program follows three structured phases; Filtration, Development, Implementation",
    likeCounter: 122,
    commentCounter: 10,
    createdAt: new Date(),
    hasLiked: false,
    userId: "",
    likedUsers: [],
    user: {
      name: "YLF",
      email: "ylf",
      avatar: require("@/assets/images/avatar.png"),
    },
    imageId: null,
    images: [],
    type: "normal",
  },
  handleLike,
  showAll = false,
  className,
}: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <View
      className={`rounded-[2rem] p-3 w-full ${className}`}
      style={{ backgroundColor: Colors[theme ?? "light"].postBackground }}
    >
      <View className="relative h-72 w-full rounded-3xl mb-3">
        <View className="absolute top-0 w-full p-3 flex-row items-center gap-3 mb-3 z-10">
          <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
            <Image
              src={imageUrl(post.user.avatar?.path || "")}
              className="w-full h-full object-cover"
            />
          </View>
          <View className="flex-row flex-1 items-start justify-between">
            <View>
              <Text className="text-white">{post.user.name}</Text>
              <Text className="text-xs text-white">{post.user.email}</Text>
            </View>
          </View>
        </View>
        <View style={{ filter: "brightness(0.5)" }}></View>
        <VideoScreen videoSource={imageUrl(post.images[0].path)} />
        <View
          className=" bottom-0 w-full py-3 px-4 rounded-b-3xl flex-row gap-2.5"
          style={{
            backgroundColor: Colors[theme ?? "light"].postFooter,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push(`/post/${post?.id}`);
            }}
            className="flex-row items-center gap-1.5"
          >
            <Comments />
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 20 }}
            >
              {post?.commentCounter}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLike(post?.id)}
            className="flex-row items-center gap-1.5"
          >
            <Heart color={post?.hasLiked ? Colors.light.primary : "#fff"} />
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 20 }}
            >
              {post?.likeCounter}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push(`/post/${post?.id}`);
        }}
      >
        <Text
          className="mb-8 dark:text-white"
          numberOfLines={showAll ? undefined : 3}
        >
          {post?.content}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPost;
