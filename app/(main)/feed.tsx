import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { get, post } from "@/hooks/axios";
import { remove } from "@/hooks/storage";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { produce } from "immer";
import NormalPost from "@/components/posts/normalPost";
import ImagePost from "@/components/posts/imagePost";
import VideoPost from "@/components/posts/videoPost";
import EventPost from "@/components/posts/eventPost";
import { Colors } from "@/constants/Colors";
import Bell from "@/assets/icons/bell";
import { useTheme } from "@/context/ThemeContext";
import { Post, Program } from "@/constants/types";
import imageUrl from "@/utils/imageUrl";
import { useLoading } from "@/context/LoadingContext";

type Props = {};

function Feed({}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  // Ref to prevent concurrent fetches
  const isFetchingRef = useRef(false);
  const router = useRouter();
  const { theme } = useTheme();

  const logout = async () => {
    await remove("token");
    router.replace("/login");
  };

  // Function for the initial load and refresh
  const loadFirstPage = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setRefreshing(true);
    // Clear current posts and reset page counter
    setPosts([]);
    setPage(1);

    try {
      showLoading();
      const res = await get("posts/getAll", {
        params: { page: 1, program: selectedProgram },
      });
      setPosts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        logout();
      }
    } finally {
      hideLoading();
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [selectedProgram]);

  // Function for loading more data (infinite scroll)
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (page >= pagination.totalPages) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await get("posts/getAll", {
        params: { page: nextPage, program: selectedProgram },
      });
      setPosts((prev) => [...prev, ...res.data.data]);
      setPagination(res.data.pagination);
      setPage(nextPage);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [page, pagination.totalPages, selectedProgram]);

  // Initial load or when the selected program changes
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const onRefresh = async () => {
    await loadFirstPage();
  };

  const handleLikePost = async (id: string) => {
    try {
      const res = await post("posts/likePost/" + id, {});
      setPosts(
        produce((draft) => {
          const index = draft.findIndex((post) => post.id === id);
          if (index !== -1) {
            draft[index].likeCounter = res.data.data.likeCounter;
            draft[index].likedUsers = res.data.data.likedUsers;
            draft[index].hasLiked = res.data.hasLiked;
          }
        })
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
      }
    }
  };

  // Fetch available programs
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
    <View
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme === "dark" ? "dark" : "light"].background,
      }}
    >
      <View className="text-white text-2xl font-bold mt-10 mb-5 flex-row justify-between w-full">
        <Image
          source={
            theme === "dark"
              ? require("@/assets/images/splash-icon-dark.png")
              : require("@/assets/images/splash-icon.png")
          }
          className="w-24 h-12"
          resizeMode="contain"
        />
        <TouchableOpacity
          className="rounded-full w-11 h-11 flex justify-center items-center"
          style={{
            backgroundColor: Colors[theme ?? "light"].bg_primary,
          }}
          onPress={() => {
            router.push("/notifications");
          }}
        >
          <Bell color={theme === "dark" ? "white" : undefined} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          horizontal
          data={[
            { id: "", logo: { path: "" }, name: "All", accentColor: undefined },
            {
              id: "general",
              logo: { path: "" },
              name: "YLF",
              accentColor: undefined,
            },
            ...programs,
          ]}
          showsHorizontalScrollIndicator={false}
          className="my-5"
          renderItem={({ item }) => (
            <View className="justify-center items-center w-20">
              <View
                className="rounded-full p-1 w-20 h-20"
                style={{
                  borderWidth: 1,
                  borderColor:
                    selectedProgram !== item.id
                      ? "transparent"
                      : item.accentColor
                      ? item.accentColor
                      : theme === "dark"
                      ? "white"
                      : "black",
                }}
              >
                <TouchableOpacity
                  className="w-full h-full bg-gray-200 rounded-full p-2 justify-center items-center"
                  onPress={() => {
                    if (selectedProgram === item.id) return;
                    setPosts([]);
                    setPage(1);
                    setSelectedProgram(item.id);
                  }}
                >
                  {item.logo.path ? (
                    <Image
                      src={imageUrl(item.logo.path)}
                      resizeMode="contain"
                      className="w-full h-full rounded-full"
                    />
                  ) : item.id === "general" ? (
                    <View className="justify-center items-center w-full h-full">
                      <Image
                        source={require("@/assets/images/splash-icon.png")}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                  ) : (
                    <View className="w-[4.5rem] h-[4.5rem] justify-center items-center">
                      <Image
                        source={require("@/assets/images/All.png")}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <Text
                className="text-center"
                style={{
                  color: item.accentColor
                    ? item.accentColor
                    : theme === "dark"
                    ? "white"
                    : "black",
                  width: 80,
                  fontFamily: "Poppins_Medium",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={() => <></>}
        data={posts}
        renderItem={({ item }) =>
          item.type === "event" ? (
            <EventPost
              post={item}
              handleLike={(id: string) => handleLikePost(id)}
              color={
                programs.find((program) => program.id === item.programId)
                  ?.accentColor
              }
            />
          ) : item.images.length > 0 ? (
            item.images[0].path.endsWith(".mp4") ? (
              <VideoPost
                handleLike={(id: string) => handleLikePost(id)}
                post={item}
                color={
                  programs.find((program) => program.id === item.programId)
                    ?.accentColor
                }
              />
            ) : (
              <ImagePost
                handleLike={(id: string) => handleLikePost(id)}
                post={item}
                color={
                  programs.find((program) => program.id === item.programId)
                    ?.accentColor
                }
              />
            )
          ) : (
            <NormalPost
              handleLike={(id: string) => handleLikePost(id)}
              post={item}
              color={
                programs.find((program) => program.id === item.programId)
                  ?.accentColor
              }
            />
          )
        }
        keyExtractor={(item) => `post-${item.id}-${item.createdAt}`}
        onEndReached={loadMore}
        ListFooterComponent={() =>
          isLoadingMore ? (
            <View className="py-4">
              <ActivityIndicator
                size="small"
                color={Colors[theme ?? "light"].primary}
              />
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default Feed;
