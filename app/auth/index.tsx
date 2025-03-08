import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View, Text, useColorScheme } from "react-native";
import { save } from "@/hooks/storage";
import { Colors } from "@/constants/Colors";

export default function AuthRedirectScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  useEffect(() => {
    (async () => {
      if (token) {
        await save("token", token.toString());
        router.replace("/feed");
      }
    })();
  }, [token]);

  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ActivityIndicator size="large" color="blue" />
      <Text style={{ marginTop: 10 }}>Signing you in...</Text>
    </View>
  );
}
