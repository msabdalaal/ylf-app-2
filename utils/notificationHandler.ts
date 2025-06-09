import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";

// ✅ Setup global handler once
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Banner while app is open
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
    enableVibrate: true,
    showBadge: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    sound: "default",
  });
}

export const setupNotifications = () => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;

      if (data?.link) {
        router.push(data.link);
      }
    }
  );

  return subscription;
};
