import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const setupNotifications = () => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      
      if (data.link) {
        router.push(data.link);
      }
    }
  );

  return subscription;
};