import Logout from "@/assets/icons/logout";
import BackButton from "@/components/buttons/backButton";
import NormalPost from "@/components/posts/normalPost";
import { Colors } from "@/constants/Colors";
import type { Comment as CommentType, Post } from "@/constants/types";
import { get, post as AxiosPost, del } from "@/hooks/axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Comment from "@/components/posts/comment";
import TextInputComponent from "@/components/inputs/textInput";
import SkinnyButton from "@/components/buttons/skinny";
import { ApplicationContext } from "@/context";
import ImagePost from "@/components/posts/imagePost";
import VideoPost from "@/components/posts/videoPost";
import EventPost from "@/components/posts/eventPost";
import { useTheme } from "@/context/ThemeContext";

export default function Post() {
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const { state } = useContext(ApplicationContext);

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

  const deleteComment = async (commentId: string) => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await del("comments/delete/" + commentId).then((res) => {
              setComments((prev) => {
                return prev.filter((comment) => comment.id !== commentId);
              });
            });
          },
        },
      ]
    );
  };
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <BackButton className="mt-5" />
      {post?.userId && post && post.type == "event" ? (
        <EventPost
          className="mt-8"
          post={post}
          handleLike={(id: string) => handleLikePost(id)}
        />
      ) : post && post.images.length > 0 ? (
        post.images[0].path.endsWith(".mp4") ? (
          <VideoPost
            handleLike={(id: string) => handleLikePost(id)}
            post={post}
            className="mt-8"
            showAll={true}
          />
        ) : (
          <ImagePost
            post={post!}
            handleLike={(id) => handleLikePost(id)}
            className="mt-8"
            showAll={true}
          />
        )
      ) : (
        <NormalPost
          post={post!}
          handleLike={(id) => handleLikePost(id)}
          className="mt-8"
          showAll={true}
        />
      )}
      <Text
        className="mt-6"
        style={{
          fontFamily: "Poppins_Medium",
          color: Colors[theme == "dark" ? "dark" : "light"].primary,
        }}
      >
        Comments
      </Text>
      <FlatList
        className="mt-3 flex-1"
        data={comments}
        renderItem={(comment) => (
          <Comment onDelete={deleteComment} comment={comment.item} />
        )}
        keyExtractor={(comment) => comment.id}
        ListEmptyComponent={() => (
          <Text className="dark:text-white">There is no comments yet</Text>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
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
