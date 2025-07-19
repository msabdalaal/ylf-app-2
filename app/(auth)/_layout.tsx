import { getValueFor } from "@/hooks/storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";

export default function WelcomeLayout() {
  const router = useRouter();
  const checkToken = async () => {
    const token = await getValueFor("token");
    if (token) {
      router.replace("/feed");
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      try {
        const url = event.url;
        // Use URL API to parse the URL
        const parsedUrl = new URL(url);
        // Get the pathname and remove leading slash if present
        const path = parsedUrl.pathname.startsWith("/")
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.pathname;
        if (path === "auth") {
          // Navigate or complete the login process
          console.log("Redirected back from Google");
        }
      } catch (error) {
        console.error("Failed to parse URL:", error);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    checkToken();
  }, []);
  return <Stack screenOptions={{ headerShown: false }} />;
}
