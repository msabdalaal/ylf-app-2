import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, Alert, Linking } from "react-native";

export interface PushNotificationState {
  notification: Notifications.Notification | undefined;
  expoPushToken: Notifications.ExpoPushToken | undefined;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      // Alert.alert(
      //   "Push Notifications",
      //   "Use a physical device for push notifications."
      // );
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Notifications Disabled",
        "To receive notifications, please enable them in Settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              }
            },
          },
        ]
      );
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas?.projectId,
    });

    setExpoPushToken(token);

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // Banner while app is open
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      }),
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        enableVibrate: true,
        showBadge: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        sound: "default",
      });
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Receive notification while app is foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif);
      });

    // Handle user interaction with the notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User responded to notification:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return { expoPushToken, notification };
};
