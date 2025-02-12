import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, RelativePathString } from "expo-router";

type Props = {
  link?: RelativePathString;
  linkText?: string;
  color?: string;
  image?: any;
};

const ProgramCard = ({
  link = "/login" as RelativePathString,
  linkText = "Banan Program",
  color = "rgba(42, 154, 151, 0.8)",
  image = require("@/assets/images/postImage.jpg"),
}: Props) => {
  return (
    <TouchableOpacity className="relative h-24 rounded-2xl bg-white overflow-hidden">
      <View style={{ filter: "brightness(0.5)" }}>
        <Image source={image} className="w-full h-full object-cover" />
      </View>
      <Link href={link} className="absolute inset-0">
        <View className="w-full h-full justify-center px-5">
          <LinearGradient
            colors={["rgba(42, 154, 151, 0)", color]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: "absolute",
              inset: 0,
            }}
          />
          <Text
            className="text-white font-bold text-xl"
            style={{ fontFamily: "Inter" }}
          >
            {linkText}
          </Text>
        </View>
      </Link>
    </TouchableOpacity>
  );
};

export default ProgramCard;
