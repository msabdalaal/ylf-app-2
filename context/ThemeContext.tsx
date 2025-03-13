import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { save, getValueFor } from "@/hooks/storage";
import { colorScheme } from "nativewind";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isSystemTheme: boolean;
  toggleSystemTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [manualTheme, setManualTheme] = useState<"light" | "dark">("light");

  // Load preferences only once at startup
  useEffect(() => {
    const loadThemePreferences = async () => {
      const savedIsSystem = await getValueFor("isSystemTheme");
      const savedTheme = await getValueFor("manualTheme");
      
      const useSystem = savedIsSystem === "true";
      setIsSystemTheme(useSystem);
      
      if (savedTheme) {
        setManualTheme(savedTheme as "light" | "dark");
      }

      // Set initial NativeWind theme
      if (useSystem) {
        colorScheme.set("system");
      } else {
        colorScheme.set((savedTheme || "light") as "light" | "dark");
      }
    };
    
    loadThemePreferences();
  }, []);

  const theme = isSystemTheme ? systemColorScheme || "light" : manualTheme;

  const toggleTheme = async () => {
    const newTheme = manualTheme === "light" ? "dark" : "light";
    setManualTheme(newTheme);
    await save("manualTheme", newTheme);
  };

  const toggleSystemTheme = async () => {
    const newIsSystem = !isSystemTheme;
    setIsSystemTheme(newIsSystem);
    await save("isSystemTheme", newIsSystem.toString());
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isSystemTheme, toggleSystemTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
