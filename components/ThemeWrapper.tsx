import { View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colorScheme } from "nativewind";
import { useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, isSystemTheme } = useTheme();

  useEffect(() => {
    colorScheme.set(isSystemTheme ? "system" : theme);
  }, [theme, isSystemTheme]);

  return <View className="flex-1">{children}</View>;
}
