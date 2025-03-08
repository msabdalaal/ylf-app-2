import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Dots from "@/assets/icons/dots";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import { Post } from "@/constants/types";
import imageUrl from "@/utils/imageUrl";
import { useRouter } from "expo-router";

type Props = {
  handleLike: (id: string) => void;
  post: Post;
  showAll?: boolean;
  className?: string;
};

const ImagePost = ({
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
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <View
      className={`rounded-[2rem] p-3 w-full ${className}`}
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
              src={post.user.avatar?.path}
              className="w-full h-full object-cover"
            />
          </View>
          <View className="flex-row flex-1 items-start justify-between">
            <View>
              <Text className="dark:text-white">{post.user.name}</Text>
              <Text className="text-xs dark:text-white">{post.user.email}</Text>
            </View>
            {/* <TouchableOpacity>
              <Dots color={colorScheme === "dark" ? "#fff" : ""} />
            </TouchableOpacity> */}
          </View>
        </View>
        <Text
          className="mb-8 dark:text-white"
          numberOfLines={showAll ? undefined : 3}
        >
          {post?.content}
        </Text>
      </TouchableOpacity>
      <View className="relative h-60 w-full rounded-3xl">
        <Image
          src={imageUrl(post.images[0].path)}
          className="w-full h-full object-cover rounded-3xl"
        />
        <View
          className="absolute bottom-0 w-full py-3 px-4 rounded-b-3xl flex-row gap-2.5"
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].postFooter,
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

export default ImagePost;
