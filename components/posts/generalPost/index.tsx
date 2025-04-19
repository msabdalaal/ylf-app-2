import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import dayjs from "dayjs";

import { Colors } from "@/constants/Colors";
import Dots from "@/assets/icons/dots";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import FileIcon from "@/assets/icons/file";
import VideoScreen from "../videoPlayer";
import imageUrl from "@/utils/imageUrl";
import PrimaryButton from "@/components/buttons/primary";
import { useTheme } from "@/context/ThemeContext";
import type { Post as BasePost, User } from "@/constants/types";

type CombinedPost = BasePost & {
  file?: { name: string; link: string };
  eventId?: string;
  programId?: string;
  isRegistered?: boolean;
  videoUrl?: string;
};

type Props = {
  post: CombinedPost;
  userOverride?: User;
  handleLike: (id: string) => void;
  color?: string;
};

const normalizeHex = (hex: string) => {
  // If 8-digit hex (#RRGGBBAA), strip alpha
  if (/^#([A-Fa-f0-9]{8})$/.test(hex)) {
    return hex.slice(0, 7);
  }
  // Otherwise assume #RRGGBB
  return hex;
};

const Post: FC<Props> = ({ post, userOverride, handleLike, color }) => {
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

  const isEvent = !!post.eventId;
  const isProgram = !!post.programId;
  const isFile = !!post.file;
  const isVideo = !!post.videoUrl;
  const hasImage = post.images?.length > 0;
  const user = userOverride ?? post.user;

  // dynamic backgrounds
  const baseColor = color ? normalizeHex(color) : null;
  const containerBg = baseColor
    ? `${baseColor}20` // 12% opacity suffix
    : Colors[theme ?? "light"].postBackground;
  const footerBg = baseColor
    ? "#0000004D" // fallback overlay
    : Colors[theme ?? "light"].postFooter;

  return (
    <View
      className="rounded-[2rem] p-3 w-full mb-4"
      style={{ backgroundColor: containerBg }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-10 h-10 bg-white rounded-full overflow-hidden">
          <Image
            src={imageUrl(user.avatar?.path ?? "")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-row flex-1 items-center justify-between">
          <Text className="dark:text-white font-medium">{user.name}</Text>
        </View>
      </View>

      {/* Body */}
      {post.content ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push(`/post/${post.id}`)}
        >
          <Text
            className="mb-4 dark:text-white"
            numberOfLines={isEvent || isProgram ? undefined : 3}
          >
            {post.content}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Media: images always first */}
      {hasImage && (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsFullscreen(true)}
            className="relative h-60 w-full rounded-3xl mb-4 overflow-hidden"
          >
            <Image
              src={imageUrl(post.images[0].path)}
              className="w-full h-full object-cover"
            />
          </TouchableOpacity>
          <Modal
            visible={isFullscreen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsFullscreen(false)}
          >
            <View className="flex-1 bg-black">
              <TouchableOpacity
                className="absolute top-10 right-5 z-10 bg-black/50 p-2 rounded-full"
                onPress={() => setIsFullscreen(false)}
              >
                <Text className="text-white text-lg">✕</Text>
              </TouchableOpacity>
              <Image
                src={imageUrl(post.images[0].path)}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </Modal>
        </>
      )}

      {/* Video (if no image) */}
      {!hasImage && isVideo && (
        <View className="relative h-60 w-full rounded-3xl mb-4">
          <VideoScreen videoSource={post.videoUrl!} />
        </View>
      )}

      {/* File (if no image/video) */}
      {!hasImage && !isVideo && isFile && (
        <View className="rounded-3xl mb-4 overflow-hidden">
          <TouchableOpacity className="flex-row items-center">
            <View
              style={{ backgroundColor: baseColor || Colors.light.primary }}
              className="p-3 rounded-tl-3xl"
            >
              <FileIcon />
            </View>
            <Text className="flex-1 py-3 px-4 text-white">
              {post.file!.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Event & Program actions */}
      {isEvent && (
        <PrimaryButton
          disabled={post.isRegistered}
          onPress={() => router.push(`/event/${post.eventId}/application`)}
          className="mb-4"
          style={{ backgroundColor: baseColor ?? Colors.light.primary }}
        >
          {post.isRegistered ? "Already Applied" : "Apply Now"}
        </PrimaryButton>
      )}
      {isProgram && (
        <PrimaryButton
          onPress={() => router.push(`/program/${post.programId}`)}
          className="mb-4"
          style={{ backgroundColor: baseColor ?? Colors.light.primary }}
        >
          Apply Now
        </PrimaryButton>
      )}

      {/* Footer */}
      <View
        className="py-3 px-4 rounded-b-3xl flex-row justify-between items-center"
        style={{ backgroundColor: footerBg }}
      >
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.push(`/post/${post.id}`)}
            className="flex-row items-center gap-1"
          >
            <Comments />
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 20 }}
            >
              {post.commentCounter}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLike(post.id)}
            className="flex-row items-center gap-1"
          >
            <Heart color={post.hasLiked ? Colors.light.primary : "#fff"} />
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 20 }}
            >
              {post.likeCounter}
            </Text>
          </TouchableOpacity>
        </View>
        {!(isEvent || isProgram) && (
          <Text className="text-xs text-white">
            {dayjs(post.createdAt).format("hh:mm A - D/M")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Post;
