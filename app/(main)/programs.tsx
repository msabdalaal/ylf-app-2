import ProgramCard from "@/components/cards/programCards";
import { Colors } from "@/constants/Colors";
import { RelativePathString } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

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
  return (
    <View className="container bg-white flex-1">
      <Text
        className="mt-10 mb-8"
        style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
      >
        Select Your Program
      </Text>
      <FlatList
        data={programs}
        renderItem={(post) => (
          <ProgramCard
            {...post.item}
            link={("/program/" + post.item.id) as RelativePathString}
          />
        )}
        keyExtractor={(post) => post.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

export default Programs;
