import { useCallback, useContext, useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { get, post } from "./axios";
import { isProfileComplete } from "@/utils/profileComplete";
import { ApplicationContext } from "@/context";
import { remove, save } from "./storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

// TODO: Replace with your actual webClientId and iosClientId if needed
const WEB_CLIENT_ID =
  "50438245803-3ih59go42akjrkti8hn1s0562t8l7577.apps.googleusercontent.com";
const IOS_CLIENT_ID =
  "50438245803-6akv0sql08lffjbjd4tr5up8k2rd39ef.apps.googleusercontent.com";

export function useGoogleSignIn() {
  const { updateState } = useContext(ApplicationContext);
  const router = useRouter();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, // From Google Cloud Console
      iosClientId: IOS_CLIENT_ID, // Only for iOS if needed
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const getProfile = useCallback(async () => {
    const user = await get("users/profile").then((res) => {
      const user = res.data.data;
      updateState("user", user);
      return user;
    });

    return user;
  }, []);

  // Logout function for Google Sign-In
  const logout = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      await remove("token");
      updateState("user", null);
      router.replace("/login");
    } catch (error) {
      console.error("Google Sign-Out error:", error);
      Alert.alert(
        "Logout Error",
        "An error occurred while logging out of Google. Please try again."
      );
    }
  }, [updateState]);

  // Call this to trigger Google Sign-In
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
        // If already signed in, sign out first
        await logout();
      }
      const { data } = await GoogleSignin.signIn();

      if (data?.user) {
        const { email, name, photo } = data.user;

        const result = await post("auth/google/signin", { email, name, photo });
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
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(
          "Sign-In Cancelled",
          "Google sign-in was cancelled by the user."
        );
        return null;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert(
          "Sign-In In Progress",
          "A Google sign-in operation is already in progress. Please wait."
        );
        return null;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          "Play Services Not Available",
          "Google Play Services is not available or outdated on this device."
        );
        return null;
      } else {
        console.error("Google Sign-In error:", error);
        Alert.alert(
          "Sign-In Error",
          "An unexpected error occurred during Google sign-in. Please try again."
        );
        return null;
      }
    }
  };

  return { signInWithGoogle, logout };
}
