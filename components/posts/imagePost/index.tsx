import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Colors } from "@/constants/Colors";
import Dots from "@/assets/icons/dots";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import { Post } from "@/constants/types";
import imageUrl from "@/utils/imageUrl";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  handleLike: (id: string) => void;
  post: Post;
  showAll?: boolean;
  className?: string;
};

const ImagePost = ({ post, handleLike, showAll = false, className }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isFullscreen) {
          setIsFullscreen(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isFullscreen]);

  return (
    <View
      className={`rounded-[2rem] p-3 w-full ${className}`}
      style={{ backgroundColor: Colors[theme ?? "light"].postBackground }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push(`/post/${post?.id}`);
        }}
      >
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
            <Image
              src={imageUrl(post.user.avatar?.path ?? "")}
              className="w-full h-full object-cover"
            />
          </View>
          <View className="flex-row flex-1 items-start justify-between">
            <View>
              <Text className="dark:text-white">{post.user.name}</Text>
              <Text className="text-xs dark:text-white">{post.user.email}</Text>
            </View>
            {/* <TouchableOpacity>
              <Dots color={theme === "dark" ? "#fff" : ""} />
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsFullscreen(true)}
        >
          <Image
            src={imageUrl(post.images[0].path)}
            className="w-full h-full object-cover rounded-3xl"
          />
        </TouchableOpacity>
        <View
          className="absolute bottom-0 w-full py-3 px-4 rounded-b-3xl flex-row gap-2.5"
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

      <Modal
        visible={isFullscreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullscreen(false)}
      >
        <View className="flex-1 bg-black">
          <TouchableOpacity
            className="absolute top-10 right-5 z-10 bg-black/50 p-2 rounded-full"
            onPress={() => setIsFullscreen(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Image
            src={imageUrl(post.images[0].path)}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export default ImagePost;
