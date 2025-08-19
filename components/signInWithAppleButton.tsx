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
      console.log("here");
      const rawNonce = randomUUID();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: rawNonce,
      });

      console.log(credential);
      console.log(credential.fullName?.givenName, credential.email);

      if (
        (credential.fullName?.givenName && credential.email) ||
        credential.user
      ) {
        const result = await post("auth/google/signin", {
          email: credential.email,
          appleUserId: credential.user,
          name: (
            credential.fullName?.givenName +
            " " +
            credential.fullName?.familyName
          ).trim(),
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
