import Bell from "@/assets/icons/bell";
import ProgramCard from "@/components/cards/programCards";
import NotificationIcon from "@/components/notificationIcon";
import { Colors } from "@/constants/Colors";
import { Program } from "@/constants/types";
import { useLoading } from "@/context/LoadingContext";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
import imageUrl from "@/utils/imageUrl";
import { RelativePathString, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type Props = {};

function Programs({}: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const { theme } = useTheme();
  const { showLoading, hideLoading } = useLoading();
  const getPrograms = useCallback(async () => {
    showLoading();
    await get("programs/getAll")
      .then((res) => {
        setPrograms(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);
  useEffect(() => {
    getPrograms();
  }, []);
  const router = useRouter();
  return (
    <View
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme == "dark" ? "dark" : "light"].background,
      }}
    >
      <View className="text-white text-2xl font-bold flex-row justify-between items-center w-full">
        <Text
          className="mt-10 mb-8"
          style={{
            fontFamily: "Poppins_Medium",
            color: theme == "dark" ? "white" : Colors.light.primary,
          }}
        >
          Select Your Program
        </Text>
        <NotificationIcon/>
      </View>
      <FlatList
        className="mb-2"
        data={programs}
        renderItem={(post) => (
          <ProgramCard
            color={post.item.accentColor}
            image={imageUrl(post.item.Image[0].path)}
            linkText={post.item.name}
            link={("/program/" + post.item.id) as RelativePathString}
            logo={imageUrl(post.item.logo.path)}
          />
        )}
        keyExtractor={(post) => post.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

export default Programs;
