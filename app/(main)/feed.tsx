import NormalPost from "@/components/posts/normalPost";
import { Post, Program } from "@/constants/types";
import { get, post } from "@/hooks/axios";
import { remove } from "@/hooks/storage";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { produce } from "immer";
import imageUrl from "@/utils/imageUrl";
import { TouchableOpacity } from "react-native";
import ImagePost from "@/components/posts/imagePost";
import VideoPost from "@/components/posts/videoPost";
import EventPost from "@/components/posts/eventPost";
import { Colors } from "@/constants/Colors";
import Bell from "@/assets/icons/bell";
import { useTheme } from "@/context/ThemeContext";
type Props = {};

function Feed({}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Add a ref to track if a request is in progress
  const isFetchingRef = useRef(false);

  const getFeed = async (refresh = false) => {
    // Set the fetching ref to true at the start
    isFetchingRef.current = true;

    if (!refresh) setIsLoadingMore(true);
    await get("posts/getAll", { params: { page, program: selectedProgram } })
      .then((res) => {
        setPosts((prev) =>
          refresh ? res.data.data : [...prev, ...res.data.data]
        );
        setPagination(res.data.pagination);
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          if (err.response?.status === 401) logout();
      })
      .finally(() => {
        setIsLoadingMore(false);
        // Set the fetching ref to false when done
        isFetchingRef.current = false;
      });
  };

  const onRefresh = async () => {
    // Only refresh if not currently fetching
    if (isFetchingRef.current) return;

    setRefreshing(true);
    setPage(1);
    setPosts([]);
    await getFeed(true);
    setRefreshing(false);
  };

  useEffect(() => {
    // Only fetch if not refreshing and not already fetching
    if (!refreshing && !isFetchingRef.current) {
      getFeed();
    }
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
    <View
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme == "dark" ? "dark" : "light"].background,
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
          className={`rounded-full w-11 h-11 flex justify-center items-center`}
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
            {
              id: "",
              logo: { path: "" },
              name: "All",
              accentColor: undefined,
            },
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
          renderItem={(item) => (
            <View className="justify-center items-center w-20">
              <View
                className="rounded-full p-1 w-20 h-20"
                style={{
                  borderWidth: 1,
                  borderColor:
                    selectedProgram !== item.item.id
                      ? "transparent"
                      : item.item.accentColor
                      ? item.item.accentColor
                      : theme === "dark"
                      ? "white"
                      : "black",
                }}
              >
                <TouchableOpacity
                  className="w-full h-full bg-gray-200 rounded-full p-2 justify-center items-center"
                  onPress={() => {
                    // Skip if the same program is selected
                    if (selectedProgram === item.item.id) return;
                    
                    setPosts([]);
                    setPage(1);
                    setSelectedProgram(item.item.id);
                  }}
                >
                  {item.item.logo.path ? (
                    <Image
                      src={imageUrl(item.item.logo.path)}
                      resizeMode="contain"
                      className="w-full h-full rounded-full"
                    />
                  ) : item.item.id == "general" ? (
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
                  color: item.item.accentColor
                    ? item.item.accentColor
                    : theme == "dark"
                    ? "white"
                    : "black",
                  width: 80,
                  fontFamily: "Poppins_Medium",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.item.name}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
      <FlatList
        refreshing={refreshing}
        onRefresh={isFetchingRef.current ? null : onRefresh}
        ListHeaderComponent={() => <></>}
        data={posts}
        renderItem={(post) =>
          post.item.type == "event" ? (
            <EventPost
              post={post.item}
              handleLike={(id: string) => handleLikePost(id)}
              color={
                selectedProgram && selectedProgram != "general"
                  ? programs.find((program) => program.id == selectedProgram)
                      ?.accentColor
                  : undefined
              }
            />
          ) : post.item.images.length > 0 ? (
            post.item.images[0].path.endsWith(".mp4") ? (
              <VideoPost
                handleLike={(id: string) => handleLikePost(id)}
                post={post.item}
                color={
                  selectedProgram && selectedProgram != "general"
                    ? programs.find((program) => program.id == selectedProgram)
                        ?.accentColor
                    : undefined
                }
              />
            ) : (
              <ImagePost
                handleLike={(id: string) => handleLikePost(id)}
                post={post.item}
                color={
                  selectedProgram && selectedProgram != "general"
                    ? programs.find((program) => program.id == selectedProgram)
                        ?.accentColor
                    : undefined
                }
              />
            )
          ) : (
            <NormalPost
              handleLike={(id: string) => handleLikePost(id)}
              post={post.item}
              color={
                selectedProgram && selectedProgram != "general"
                  ? programs.find((program) => program.id == selectedProgram)
                      ?.accentColor
                  : undefined
              }
            />
          )
        }
        keyExtractor={(post) => `post-${post.id}-${post.createdAt}`}
        onEndReached={() => {
          // Only load more if not refreshing, not already loading more, and not fetching
          if (
            page < pagination.totalPages &&
            !isLoadingMore &&
            !refreshing &&
            !isFetchingRef.current
          ) {
            setPage(page + 1);
          }
        }}
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
