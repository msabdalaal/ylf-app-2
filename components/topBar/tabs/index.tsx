import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Link, RelativePathString, usePathname } from "expo-router";

type Props = {
  links: {
    name: string;
    link: string;
  }[];
};

const TopBarTabs = ({
  links = [
    {
      name: "Log in",
      link: "/",
    },
    {
      name: "Sign up",
      link: "/login",
    },
  ],
}: Props) => {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  return (
    <View className="w-full flex-row items-center justify-between px-6 pt-5">
      {links.map((link, index) => (
        <Link
          replace={true}
          href={link.link as RelativePathString}
          key={index}
          className="flex-1 border-b-2"
          style={{
            borderColor:
              link.link === pathname
                ? Colors[colorScheme ?? "light"].primary
                : "transparent",
          }}
        >
          <Text
            className="text-center text-lg"
            style={{
              color:
                link.link === pathname
                  ? Colors[colorScheme ?? "light"].primary
                  : Colors[colorScheme ?? "light"].border,
              fontFamily: "Poppins_Medium",
              lineHeight: 20,
              fontWeight: "bold",
            }}
          >
            {link.name}
          </Text>
        </Link>
      ))}
    </View>
  );
};

export default TopBarTabs;
