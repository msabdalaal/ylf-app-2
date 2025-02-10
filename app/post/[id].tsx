import Logout from "@/assets/icons/logout";
import BackButton from "@/components/buttons/backButton";
import NormalPost from "@/components/posts/normalPost";
import { Colors } from "@/constants/Colors";
import type { Comment as CommentType, Post } from "@/constants/types";
import { get, post as AxiosPost } from "@/hooks/axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Comment from "@/components/posts/comment";
import TextInputComponent from "@/components/inputs/textInput";
import SkinnyButton from "@/components/buttons/skinny";
type Props = {};

export default function Post({}: Props) {
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
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
        setComments(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
  };
  useEffect(() => {
    getPost();
  }, []);

  const handleLikePost = async (id: string) => {
    await AxiosPost("posts/likePost/" + id, {})
      .then((res) => {
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            likeCounter: res.data.data.likeCounter,
            likedUsers: res.data.data.likedUsers,
            hasLiked: res.data.hasLiked,
          };
        });
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
  };

  const handlePostComment = async () => {
    setLoading(true);
    await AxiosPost("comments/create/" + id, {
      content: newComment,
    })
      .then((res) => {
        setComments((prev) => {
          return [...prev, res.data.data];
        });
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        setNewComment("");
        setLoading(false);
      });
  };

  return (
    <SafeAreaView className="container bg-white flex-1">
      <BackButton />
      {post?.userId && (
        <NormalPost
          post={post!}
          handleLike={(id) => handleLikePost(id)}
          className="mt-8"
        />
      )}
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
        className="mt-6"
        style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
      >
        Comments
      </Text>
      <FlatList
        className="mt-3 flex-1"
        data={comments}
        renderItem={(comment) => <Comment comment={comment.item} />}
        keyExtractor={(comment) => comment.id}
        ListEmptyComponent={() => <Text>There is no comments yet</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
      <View className="pt-2 pb-3 flex-row items-center gap-4">
        <TextInputComponent
          value={newComment}
          onChange={setNewComment}
          className="flex-1"
          onEnter={handlePostComment}
        />
        <View className="">
          <SkinnyButton onPress={handlePostComment} className="m-0 px-0">
            {loading ? "Posting..." : "Post"}
          </SkinnyButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
