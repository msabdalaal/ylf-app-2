import BackButton from "@/components/buttons/backButton";
import NormalPost from "@/components/posts/normalPost";
import { Post } from "@/constants/types";
import { get, post } from "@/hooks/axios";
import { remove } from "@/hooks/storage";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { produce } from "immer";
type Props = {};

function Feed({}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
  });
  const router = useRouter();
  const logout = async () => {
    await remove("token");
    router.replace("/");
  };
  const [page, setPage] = useState(1);
  const getFeed = async () => {
    await get("posts/getAll", { params: { page } })
      .then((res) => {
        setPosts(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          if (err.response?.status === 401) logout();
      });
  };
  useEffect(() => {
    getFeed();
  }, [page]);

  const handleLikePost = async (id: string) => {
    await post("posts/likePost/" + id, {})
      .then((res) => {
        setPosts(
          produce((draft) => {
            const index = draft.findIndex((post) => post.id === id);
            draft[index].likeCounter = res.data.data.likeCounter;
            draft[index].likedUsers = res.data.data.likedUsers;
            draft[index].hasLiked = res.data.hasLiked;
          })
        );
      })
      .catch((err) => {
        if (err instanceof AxiosError) console.log(err.response?.data.message);
      });
  };
  
  return (
    <View className="bg-white flex-1">
      <FlatList
        data={posts}
        renderItem={(post) => (
          <NormalPost
            handleLike={(id: string) => handleLikePost(id)}
            post={post.item}
          />
        )}
        keyExtractor={(post) => post.id}
        onEndReached={() => {
          if (page < pagination.totalPages) setPage(page + 1);
        }}
        ListHeaderComponent={() => (
          <View className="text-white text-2xl font-bold mt-3 mb-7">
            <Image
              source={require("@/assets/images/splash-icon.png")}
              className="w-24 h-12"
              resizeMode="contain"
            />
          </View>
        )}
        className="container mt-10"
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

export default Feed;
