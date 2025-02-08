import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Comments from "@/assets/icons/comments";
import Heart from "@/assets/icons/Heart";
import Play from "@/assets/icons/play";

type Props = {
  user: {
    name: string;
    avatar: any;
  };
  post: {
    body: string;
    likesCount: number;
    commentsCount: number;
    image: any;
  };
};

const VideoPost = ({
  user = {
    name: "Profile Name",
    avatar: require("@/assets/images/avatar.png"),
  },
  post = {
    body: "The program follows three structured phases; Filtration, Development, Implementation",
    likesCount: 122,
    commentsCount: 10,
    image: require("@/assets/images/postImage.jpg"),
  },
}: Props) => {
  const colorScheme = useColorScheme();

  return (
    <View
      className="rounded-[2rem] p-3 w-full"
      style={{ backgroundColor: Colors[colorScheme ?? "light"].postBackground }}
    >
      <View className="relative h-72 w-full rounded-3xl mb-3">
        <View className="absolute top-0 w-full p-3 flex-row items-center gap-3 mb-3 z-10">
          <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
            <Image
              source={user.avatar}
              className="w-full h-full object-cover"
            />
          </View>
          <View className="flex-row flex-1 items-start justify-between">
            <View>
              <Text className="text-white">{user.name}</Text>
              <Text className="text-xs text-white">{user.name}</Text>
            </View>
          </View>
        </View>
        <View style={{ filter: "brightness(0.5)" }}>
          <Image
            source={post.image}
            className="w-full h-full object-cover rounded-3xl"
          />
        </View>
        <TouchableOpacity
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full justify-center items-center"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].postFooter }}
        >
          <Play />
        </TouchableOpacity>
        <View
          className="absolute bottom-0 w-full py-3 px-4 rounded-b-3xl flex-row gap-2.5"
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].postFooter,
          }}
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
      <Text className="px-3">
        {post.body.length > 70 ? `${post.body.substring(0, 70)}...` : post.body}
        {post.body.length > 70 && (
          <Text
            className=""
            style={{
              color: Colors[colorScheme ?? "light"].primary,
              fontWeight: 500,
            }}
          >
            Read more
          </Text>
        )}
      </Text>
    </View>
  );
};

export default VideoPost;
