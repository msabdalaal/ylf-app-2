import Bell from "@/assets/icons/bell";
import ProgramCard from "@/components/cards/programCards";
import { Colors } from "@/constants/Colors";
import { Program } from "@/constants/types";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
import imageUrl from "@/utils/imageUrl";
import { RelativePathString, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type Props = {};

const programs: {
  id: number;
  linkText?: string;
  color?: string;
  image?: any;
}[] = [
  {
    id: 1,
    color: "#2A9A97CC",
    image: require("@/assets/images/program1.png"),
    linkText: "Banan Program (بَنَان)",
  },
  {
    id: 2,
    color: "#015CA4CC",
    image: require("@/assets/images/program2.png"),
    linkText: "leadership Program",
  },
  {
    id: 3,
    color: "#AB4057CC",
    image: require("@/assets/images/program3.png"),
    linkText: "She Leads Program",
  },
  {
    id: 4,
    color: "#FF5D00CC",
    image: require("@/assets/images/program4.png"),
    linkText: "Learning Expert Program",
  },
];

function Programs({}: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const { theme } = useTheme();
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
      <FlatList
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
