import React from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Href, Link } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

interface PrimaryLinkProps {
  children: React.ReactNode;
  href: Href;
  className?: string;
  TextClassName?: string;
  replace?: boolean;
  bold?: boolean;
}

const SkinnyLink = ({
  children,
  href,
  className,
  replace = false,
  bold = false,
  TextClassName,
}: PrimaryLinkProps) => {
  const { theme } = useTheme();
  return (
    <Link
      replace={replace}
      href={href}
      className={`px-4 py-[18px] rounded-xl w-full ${className}`}
    >
      <Text
        style={{
          fontFamily: "Inter",
          color: Colors[theme ?? "light"].primary,
          fontWeight: bold ? "bold" : "normal",
        }}
        className={`text-center ${TextClassName}`}
      >
        {children}
      </Text>
    </Link>
  );
};

export default SkinnyLink;
