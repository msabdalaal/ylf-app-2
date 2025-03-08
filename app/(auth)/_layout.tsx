import { getValueFor } from "@/hooks/storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function WelcomeLayout() {
  const router = useRouter();
  const checkToken = async () => {
    const token = await getValueFor("token");
    if (token) {
      router.replace("/feed");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  return <Stack screenOptions={{ headerShown: false}}  />;
}
