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

  // Call this to trigger Google Sign-In
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { data } = await GoogleSignin.signIn();

      if (data?.user) {
        const { email, name, photo } = data.user;
        console.log(email, name, photo);

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
        // user cancelled the login flow
        return null;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        return null;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        return null;
      } else {
        // some other error
        console.error("Google Sign-In error:", error);
        return null;
      }
    }
  };

  return { signInWithGoogle };
}
