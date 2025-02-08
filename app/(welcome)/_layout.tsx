import { getValueFor, remove, save } from "@/hooks/storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function WelcomeLayout() {
  const router = useRouter();
  const checkToken = async () => {
    const token = await getValueFor("token");
    const hasViewedWelcome = await getValueFor("hasViewedWelcome");
    if (token) {
      router.replace("/feed");
    } else if (hasViewedWelcome == "true") {
      router.replace("/login");
    } else {
      await save("hasViewedWelcome", "true");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
