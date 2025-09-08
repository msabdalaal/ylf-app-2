import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet } from "react-native";
import { randomUUID } from "expo-crypto";
import { get, post } from "@/hooks/axios";
import { remove, save } from "@/hooks/storage";
import { useCallback, useContext } from "react";
import { ApplicationContext } from "@/context";
import { isProfileComplete } from "@/utils/profileComplete";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import * as SecureStore from "expo-secure-store";

// Helper functions for SecureStore
async function ssSet(key: string, value?: string | null) {
  try {
    if (value == null) return;
    await SecureStore.setItemAsync(key, value);
  } catch {}
}
async function ssGet(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export function SignInWithAppleButton() {
  const { theme } = useTheme();
  const router = useRouter();
  const { updateState } = useContext(ApplicationContext);

  const getProfile = useCallback(async () => {
    const user = await get("users/profile").then((res) => {
      const user = res.data.data;
      updateState("user", user);
      return user;
    });

    return user;
  }, []);
  const signInWithApple = async () => {
    try {
      const rawNonce = randomUUID();
      // Apple only provides full name & email on first sign-in; we persist them in SecureStore for reuse.
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: rawNonce,
      });

      if (credential.user) {
        // Compose name/email from credential when available, otherwise fallback to SecureStore.
        const composedName = (
          (credential.fullName?.givenName || "") +
          " " +
          (credential.fullName?.familyName || "")
        ).trim();

        let name = composedName || (await ssGet("appleName")) || "";
        let email = credential.email || (await ssGet("appleEmail")) || "";

        // Persist for future logins (Apple only returns email/fullName on first consent)
        await ssSet("appleUserId", credential.user);
        await ssSet("appleName", composedName || name);
        await ssSet("appleEmail", credential.email || email);

        const result = await post("auth/apple/signin", {
          appleUserId: credential.user,
          // Send email/name only if we have values
          ...(email ? { email } : {}),
          ...(name ? { name } : {}),
        });
        const access_token = result.data.access_token;
        await save("token", access_token);

        const user = await getProfile();
        if (!isProfileComplete(user)) {
          await remove("token");
          router.replace({
            pathname: "/auth",
            params: { token: result.data.access_token },
          });
        } else {
          router.replace("/feed");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        theme === "dark"
          ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
          : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={5}
      style={styles.button}
      onPress={signInWithApple}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 44,
  },
});
