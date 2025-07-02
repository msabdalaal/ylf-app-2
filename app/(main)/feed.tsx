import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from "react-native";
import { get, post } from "@/hooks/axios";
import { remove } from "@/hooks/storage";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "expo-router";
import { produce } from "immer";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Post, Program } from "@/constants/types";
import imageUrl from "@/utils/imageUrl";
import { useLoading } from "@/context/LoadingContext";
import PostComponent from "@/components/posts/generalPost";
import NotificationIcon from "@/components/notificationIcon";
import { usePosts } from "@/context/postsContext";

function Feed() {
  const { setPosts, posts } = usePosts();
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
  const pathname = usePathname();
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
      await getPrograms();
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
        produce((draft: Post[]) => {
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

  const appState = useRef(AppState.currentState);

  // Function to handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");

        // Check if current path is feed before refreshing
        const currentPath = pathname;
        console.log(pathname);
        if (currentPath === "/feed") {
          console.log("Currently on feed path, refreshing data");
          // Refresh data when app comes to foreground and we're on feed
          loadFirstPage();
        } else {
          console.log("Not on feed path, skipping refresh");
        }
      }
      appState.current = nextAppState;
    },
    [loadFirstPage, pathname]
  );

  // Set up AppState listener
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  return (
    <View
      className=" bg-white flex-1"
      style={{
        backgroundColor: Colors[theme === "dark" ? "dark" : "light"].background,
      }}
    >
      <View className="container text-white text-2xl font-bold mt-10 mb-5 flex-row justify-between w-full">
        <Image
          source={
            theme === "dark"
              ? require("@/assets/images/splash-icon-dark.png")
              : require("@/assets/images/splash-icon.png")
          }
          className="w-24 h-12"
          resizeMode="contain"
        />
        <NotificationIcon />
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
          contentContainerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
          }}
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
                  className={`w-full h-full rounded-full p-2 justify-center items-center
                    ${item.logo.path ? "bg-[#015CA4]" : "bg-gray-200"}
                    `}
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
                  color:
                    selectedProgram === item.id && item.accentColor
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
      <View className="container flex-1">
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={posts}
          keyExtractor={(item) => `post-${item.id}-${item.createdAt}`}
          renderItem={({ item }) => {
            const accentColor = programs.find(
              (p) => p.id === item.programId
            )?.accentColor;

            return (
              <PostComponent
                post={item}
                handleLike={handleLikePost}
                color={accentColor}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() =>
            isLoadingMore ? (
              <View style={{ marginBottom: 5 }}>
                <ActivityIndicator
                  size="small"
                  color={Colors[theme]?.primary}
                />
              </View>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80, // يعوض المساحة السفلية ويخلي المؤشر يبان
            paddingTop: 12,
          }}
        />
      </View>
    </View>
  );
}

export default Feed;
