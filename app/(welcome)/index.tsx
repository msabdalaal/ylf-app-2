// app/(welcome)/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getValueFor, save } from "@/hooks/storage";

export default function WelcomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const token = await getValueFor("token");
      const hasViewedWelcome = await getValueFor("hasViewedWelcome");

      if (token) {
        router.replace("/(main)/feed");
      } else if (hasViewedWelcome === "true") {
        router.replace("/(auth)/login");
      } else {
        await save("hasViewedWelcome", "true");
        router.replace("/(welcome)/welcome1"); // move your actual welcome screen to welcome.tsx
      }
    };

    checkAndRedirect();
  }, []);

  return null;
}
