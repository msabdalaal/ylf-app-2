import React from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, Href } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

interface PrimaryLinkProps {
  children: React.ReactNode;
  href: Href;
  className?: string;
  replace?: boolean;
  style?: object;
  disabled?: boolean;
}

const PrimaryLink = ({
  children,
  href,
  className,
  replace = false,
  style = {},
  disabled,
}: PrimaryLinkProps) => {
  const { theme } = useTheme();
  return (
    <Link
      replace={replace}
      href={href}
      className={`px-4 py-[18px] rounded-xl w-full ${className}`}
      style={{
        backgroundColor: Colors[theme ?? "light"].ButtonPrimary,
        ...style,
      }}
      disabled={disabled}
    >
      <Text
        style={{ fontFamily: "Inter" }}
        className="text-white font-bold text-center"
      >
        {children}
      </Text>
    </Link>
  );
};

export default PrimaryLink;
