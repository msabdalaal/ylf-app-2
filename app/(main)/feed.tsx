import BackButton from "@/components/buttons/backButton";
import NormalPost from "@/components/posts/normalPost";
import { Post, Program } from "@/constants/types";
import { get, post } from "@/hooks/axios";
import { remove } from "@/hooks/storage";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { produce } from "immer";
import imageUrl from "@/utils/imageUrl";
import { TouchableOpacity } from "react-native";
type Props = {};

function Feed({}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
  });
  const router = useRouter();
  const logout = async () => {
    await remove("token");
    router.replace("/login");
  };
  const [page, setPage] = useState(1);
  const getFeed = async () => {
    await get("posts/getAll", { params: { page, program: selectedProgram } })
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
  }, [page, selectedProgram]);

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

  const [programs, setPrograms] = useState<Program[]>([]);
  const getPrograms = useCallback(async () => {
    await get("programs/getAll")
      .then((res) => {
        setPrograms(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getPrograms();
  }, []);

  return (
    <View className="container bg-white flex-1">
      <View className="text-white text-2xl font-bold mt-10 mb-5">
        <Image
          source={require("@/assets/images/splash-icon.png")}
          className="w-24 h-12"
          resizeMode="contain"
        />
        <FlatList
          horizontal
          data={[
            { id: "", logo: { path: "" } },
            { id: "general", logo: { path: "" } },
            ...programs,
          ]}
          showsHorizontalScrollIndicator={false}
          className="mt-5"
          renderItem={(item) => (
            <TouchableOpacity
              className="w-20 h-20 bg-gray-200 rounded-full p-2 justify-center items-center"
              onPress={() => setSelectedProgram(item.item.id)}
            >
              {item.item.logo.path ? (
                <Image
                  src={imageUrl(item.item.logo.path)}
                  resizeMode="contain"
                  className="w-full h-full rounded-full"
                />
              ) : item.item.id == "general" ? (
                <Text className="text-center text-gray-500 justify-center items-center">
                  General
                </Text>
              ) : (
                <Text className="text-center text-gray-500 justify-center items-center">
                  All Posts
                </Text>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
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
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default Feed;
