import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import { Colors } from "@/constants/Colors";
import Dots from "@/assets/icons/dots";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import { Post } from "@/constants/types";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import imageUrl from "@/utils/imageUrl";
type Props = {
  post: Post;
  handleLike: (id: string) => void;
  className?: string;
  showAll?: boolean;
};

const NormalPost = ({
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
  className = "",
  showAll = false,
}: Props) => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View
      className={`rounded-[2rem] p-3 w-full h-fit ${className}`}
      style={{ backgroundColor: Colors[colorScheme ?? "light"].postBackground }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push(`/post/${post?.id}`);
        }}
      >
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
            <Image
              src={imageUrl(post?.user?.avatar?.path ?? "")}
              className="w-full h-full object-cover"
            />
          </View>
          <View className="flex-row flex-1 items-start justify-between">
            <View>
              <Text className="dark:text-white">
                {post?.user?.name ?? "YLF"}
              </Text>
              <Text className="text-xs dark:text-white">
                {post?.user?.email ?? "@ylf"}
              </Text>
            </View>
            {/* <TouchableOpacity>
              <Dots />
            </TouchableOpacity> */}
          </View>
        </View>
        <Text className="mb-8 dark:text-white" numberOfLines={showAll ? undefined : 3}>
          {post?.content}
        </Text>
      </TouchableOpacity>
      <View
        className="py-3 px-4 rounded-b-3xl flex-row justify-between items-center"
        style={{ backgroundColor: Colors[colorScheme ?? "light"].postFooter }}
      >
        <View className="flex-row gap-2.5">
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
        <Text className="text-xs text-white">
          {dayjs(post?.createdAt).format("hh:mm A - D/M")}
        </Text>
      </View>
    </View>
  );
};

export default NormalPost;
