import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import type { Comment as CommentType, Post, Program } from "@/constants/types";
import { get, post as AxiosPost, del } from "@/hooks/axios";
import { AxiosError } from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Comment from "@/components/posts/comment";
import TextInputComponent from "@/components/inputs/textInput";
import SkinnyButton from "@/components/buttons/skinny";
import { setupNotifications } from "@/utils/notificationHandler";
import { useTheme } from "@/context/ThemeContext";
import { useLoading } from "@/context/LoadingContext";
import PostComponent from "@/components/posts/generalPost";
import {
  addPendingComment,
  removePendingComment,
  PendingComment,
} from "@/utils/commentQueue";
import { useNetInfo } from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { usePosts } from "@/context/postsContext";
import { ApplicationContext } from "@/context";

export default function Post() {
  const {
    state: { user },
  } = useContext(ApplicationContext);
  const { updatePost } = usePosts();
  const headerHeight = useHeaderHeight();
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const netInfo = useNetInfo();
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const subscription = setupNotifications();
    return () => subscription.remove();
  }, []);
  const { showLoading, hideLoading } = useLoading();

  const getPost = async () => {
    showLoading();
    await get("posts/get/" + id)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        hideLoading();
      });
    showLoading();
    await get("comments/getPostComments/" + id)
      .then((res) => {
        setComments(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      })
      .finally(() => {
        hideLoading();
      });
  };

  // Update online status
  useEffect(() => {
    setIsOnline(!!netInfo.isInternetReachable);
  }, [netInfo.isInternetReachable]);

  // Load post and comments
  useFocusEffect(
    React.useCallback(() => {
      getPost();
    }, [])
  );

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
        if (post?.id) {
          updatePost({
            ...post,
            likeCounter: res.data.data.likeCounter,
            likedUsers: res.data.data.likedUsers,
            hasLiked: res.data.hasLiked,
          });
        }
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    const tempId = `temp_${Date.now()}`;
    const commentData = {
      id: tempId,
      postId: id as string,
      content: newComment.trim(),
      user: {
        // Add minimal user data for local display
        id: "current-user",
        name: "You",
        avatar: null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to local state immediately for instant feedback
    setComments((prev) => [commentData as unknown as CommentType, ...prev]);
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        commentCounter: (prev.commentCounter ?? 0) + 1,
      };
    });
    if (post?.id) {
      updatePost({
        ...post,
        commentCounter: (post.commentCounter ?? 0) + 1,
      });
    }

    // Add to pending comments queue
    await addPendingComment({
      id: tempId,
      postId: id as string,
      content: newComment.trim(),
    });

    // Clear input
    setNewComment("");
    setLoading(false);

    // Try to post to server
    try {
      const response = await AxiosPost("comments/create/" + id, {
        content: newComment.trim(),
      });

      // Update the comment with server data when successful
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? response.data.data : c))
      );

      // Remove from pending queue
      await removePendingComment(tempId);
    } catch (error) {
      console.error("Failed to post comment:", error);
      // The comment remains in the queue and will be retried
    }
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
  const [programs, setPrograms] = useState<Program[]>([]);
  const getPrograms = useCallback(async () => {
    try {
      const res = await get("programs/getAll");
      setPrograms(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getPrograms();
  }, [getPrograms]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="container px-4">
            <BackButton className="my-5" />
            {post && (
              <PostComponent
                post={post}
                handleLike={handleLikePost}
                color={
                  programs.find((p) => p.id === post.programId)?.accentColor ||
                  ""
                }
                fullPost
              />
            )}
            {Number(user?.age) >= 18 && (
              <Text
                className="mt-6"
                style={{
                  fontFamily: "Poppins_Medium",
                  color: Colors[theme == "dark" ? "dark" : "light"].primary,
                }}
              >
                Comments
              </Text>
            )}
          </View>

          {Number(user?.age) >= 18 && (
            <View className="flex-1 px-4">
              {comments.length > 0 ? (
                <FlatList
                  data={comments}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View
                      className={`relative mb-3 ${
                        pendingComments.some((c) => c.id === item.id)
                          ? "opacity-70"
                          : ""
                      }`}
                    >
                      <Comment onDelete={deleteComment} comment={item} />
                      {pendingComments.some((c) => c.id === item.id) && (
                        <View className="absolute top-1 right-1 bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded-full">
                          <Text className="text-xs text-yellow-800 dark:text-yellow-200">
                            {isOnline
                              ? "Sending..."
                              : "Offline - will send when online"}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  keyExtractor={(comment) => comment.id}
                  contentContainerStyle={{
                    paddingBottom: 24,
                  }}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text className="dark:text-white text-center py-4">
                  There are no comments yet
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {Number(user?.age) >= 18 && (
        <View
          className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pt-3 pb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            paddingBottom: Platform.OS === "ios" ? 34 : 24, // Extra padding for iOS home indicator
          }}
        >
          <View className="flex-row items-center gap-3">
            <TextInputComponent
              value={newComment}
              onChange={setNewComment}
              className="flex-1"
              onEnter={handlePostComment}
              placeholder="Write a comment..."
            />
            <SkinnyButton
              onPress={handlePostComment}
              className="m-0 px-4 py-2 self-end"
              disabled={!newComment.trim()}
            >
              {loading ? "Posting..." : "Post"}
            </SkinnyButton>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
