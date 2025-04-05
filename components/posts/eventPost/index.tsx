import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Dots from "@/assets/icons/dots";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import { Post } from "@/constants/types";
import imageUrl from "@/utils/imageUrl";
import PrimaryButton from "@/components/buttons/primary";
import { post as postAxios } from "@/hooks/axios";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
type Props = {
  post: Post;
  handleLike: (id: string) => void;
  className?: string;
  color?: string | undefined;
};

const EventPost = ({
  className,
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
  color,
}: Props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const handleApply = async () => {
    await postAxios("events/submitApplication/" + post.eventId, {})
      .then(() => {
        router.push("/program/0/submitSuccess");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View
      className={`rounded-[2rem] p-3 w-full ${className}`}
      style={{
        backgroundColor: color
          ? `${color}20`
          : Colors[theme ?? "light"].postBackground,
      }}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
          <Image
            src={imageUrl(post.user.avatar?.path || "")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <View className="flex-row flex-1 items-start justify-between">
          <View>
            <Text className="dark:text-white">{post.user.name}</Text>
            <Text className="text-xs dark:text-white">{post.user.email}</Text>
          </View>
          {/* <TouchableOpacity>
            <Dots />
          </TouchableOpacity> */}
        </View>
      </View>
      <Text className="mb-8 dark:text-white">{post.content}</Text>
      <View className="rounded-3xl">
        <PrimaryButton
          disabled={post.isRegistered}
          onPress={handleApply}
          className="mb-2"
        >
          {post.isRegistered ? "Already Applied" : "Apply Now"}
        </PrimaryButton>
        <View
          className="w-full py-3 px-6 rounded-b-3xl flex-row gap-2.5"
          style={{
            backgroundColor: color
              ? "#0000004D"
              : Colors[theme ?? "light"].postFooter,
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
    </View>
  );
};

export default EventPost;
