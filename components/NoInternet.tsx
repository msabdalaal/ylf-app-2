import { View, Text, RefreshControl, ScrollView } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import NoConnection from "@/assets/icons/no-connection";

type Props = {
  onRefresh: () => void;
};

export default function NoInternet({ onRefresh }: Props) {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#121212]"
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={handleRefresh}
          tintColor={theme === "dark" ? "#fff" : Colors.light.primary}
        />
      }
    >
      <View className="flex-1 justify-center items-center p-4">
        <NoConnection color={theme === "dark" ? "white" : Colors.light.primary} />
        <Text
          className="text-xl mt-4 text-center dark:text-white"
          style={{
            fontFamily: "Poppins_Medium",
          }}
        >
          No Internet Connection
        </Text>
        <Text
          className="text-center mt-2 text-gray-600 dark:text-gray-400"
          style={{
            fontFamily: "Poppins",
          }}
        >
          Please check your connection and pull down to refresh
        </Text>
      </View>
    </ScrollView>
  );
}