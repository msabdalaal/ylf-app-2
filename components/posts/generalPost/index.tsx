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
import * as Linking from "expo-linking";
import dayjs from "dayjs";

import { Colors } from "@/constants/Colors";
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
};

type Props = {
  post: CombinedPost;
  userOverride?: User;
  handleLike: (id: string) => void;
  color?: string;
  fullPost?: boolean;
};

const normalizeHex = (hex: string) => {
  // If 8-digit hex (#RRGGBBAA), strip alpha
  if (/^#([A-Fa-f0-9]{8})$/.test(hex)) {
    return hex.slice(0, 7);
  }
  // Otherwise assume #RRGGBB
  return hex;
};

// URL regex pattern to detect links
// Updated regex to also match www. links (without protocol)
const urlRegex =
  /((https?:\/\/|www\.)[a-zA-Z0-9\-._~%]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/[^\s]*)?)/gi;

// Function to render text with clickable links
const renderTextWithLinks = (
  text: string,
  isDark: boolean,
  numberOfLines?: number
) => {
  if (!text) return null;
  // Find all matches and split text accordingly
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(
        <Text key={key++} style={{ color: isDark ? "white" : "black" }}>
          {text.slice(lastIndex, match.index)}
        </Text>
      );
    }
    let url = match[0];
    // Ensure url has protocol for www. links
    let openUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : url.startsWith("www.")
        ? `https://${url}`
        : url;
    parts.push(
      <Text
        key={key++}
        style={{
          color: Colors.light.primary,
          textDecorationLine: "underline",
        }}
        onPress={() => Linking.openURL(openUrl)}
        suppressHighlighting
      >
        {url}
      </Text>
    );
    lastIndex = match.index + url.length;
  }
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(
      <Text key={key++} style={{ color: isDark ? "white" : "black" }}>
        {text.slice(lastIndex)}
      </Text>
    );
  }
  return <Text numberOfLines={numberOfLines}>{parts}</Text>;
};

const Post: FC<Props> = ({
  post,
  userOverride,
  handleLike,
  color,
  fullPost,
}) => {
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
  const isProgram = !!post.programId && !post.eventId;
  const isFile = !!post.file;
  const isVideo = post.images[0]?.path
    ?.toLowerCase()
    .match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/);
  const hasImage =
    post.images?.length > 0 &&
    !post.images[0]?.path
      ?.toLowerCase()
      .match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/);

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
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-10 h-10 bg-white rounded-full overflow-hidden items-center justify-center">
          {user.avatar?.path ? (
            <Image
              src={imageUrl(user.avatar.path)}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                backgroundColor: color || "#015CA4",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  fontFamily: "Poppins_Medium",
                }}
              >
                {(() => {
                  if (!user.name) return "";
                  const parts = user.name.trim().split(" ");
                  if (parts.length === 1) {
                    return parts[0][0]?.toUpperCase();
                  }
                  return (
                    parts[0][0]?.toUpperCase() +
                    (parts[1][0]?.toUpperCase() ||
                      parts[parts.length - 1][0]?.toUpperCase() ||
                      "")
                  );
                })()}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row flex-1 items-center justify-between">
          <Text className="dark:text-white font-medium">{user.name}</Text>
        </View>
      </View>

      {post.content ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push(`/post/${post.id}`)}
          className="mb-4"
        >
          {renderTextWithLinks(
            post.content,
            theme === "dark",
            fullPost ? undefined : 3
          )}
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
          <VideoScreen videoSource={imageUrl(post.images[0]?.path)} />
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
