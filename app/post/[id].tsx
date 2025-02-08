import Logout from "@/assets/icons/logout";
import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import type { Post } from "@/constants/types";
import { get } from "@/hooks/axios";
import { AxiosError } from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

export default function Post({}: Props) {
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Post[]>([]);
  const { id } = useLocalSearchParams();
  const getPost = async () => {
    await get("posts/get/" + id)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
    await get("comments/getPostComments/" + id)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
  };
  useEffect(() => {
    getPost();
  }, []);
  return (
    <SafeAreaView className="container bg-white flex-1">
      <BackButton />
      {/* <Text
        className="mt-2 mb-8"
        style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
      >
        Likes
      </Text>
      <FlatList
        horizontal
        data={post?.likedUsers}
        renderItem={(user) => <Text>{user.item}</Text>}
      /> */}
      <Text
        className="mt-2"
        style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
      >
        Comments
      </Text>
      <Text>there is no comments yet</Text>
    </SafeAreaView>
  );
}
