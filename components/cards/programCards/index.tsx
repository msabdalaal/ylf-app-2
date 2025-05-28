import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, RelativePathString } from "expo-router";

type Props = {
  link?: RelativePathString;
  linkText?: string;
  color?: string;
  image?: any;
  logo?: any;
};

export const adjustColorOpacity = (color: string, opacity: number) => {
  // Handle hex color
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // Handle rgba
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+(?=\))/, opacity.toString());
  }
  // Handle rgb
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  return color; // Return original if format not recognized
};

const ProgramCard = ({
  link = "/login" as RelativePathString,
  linkText = "Banan Program",
  color = "rgba(42, 154, 151, 0.8)",
  image = "",
  logo = "",
}: Props) => {
  return (
    <TouchableOpacity className="relative h-24 rounded-2xl bg-white overflow-hidden">
      <View style={{ filter: "brightness(0.5)" }}>
        <Image src={image} className="w-full h-full object-cover" />
      </View>
      <Link href={link} className="absolute inset-0">
        <View className="w-full h-full justify-center px-5">
          <LinearGradient
            colors={["rgba(42, 154, 151, 0)", adjustColorOpacity(color, 0.6)]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: "absolute",
              inset: 0,
            }}
            className=""
          />
          <View className="flex-row items-center justify-between">
            <Text
              className="text-white font-bold text-xl"
              style={{ fontFamily: "Inter" }}
            >
              {linkText}
            </Text>
            <View className="py-2">
              <Image src={logo} className="h-full w-20" resizeMode="contain" />
            </View>
          </View>
        </View>
      </Link>
    </TouchableOpacity>
  );
};

export default ProgramCard;
