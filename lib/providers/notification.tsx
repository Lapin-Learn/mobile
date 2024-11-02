import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Href, router } from 'expo-router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { requestPermission } from '../utils/permissions';

type NotificationResponse = Notifications.NotificationResponse;

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [appState, setAppState] = useState(AppState.currentState);

  const checkNotificationPermission = async () => {
    await requestPermission();
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      await checkNotificationPermission();
    }
    setAppState(nextAppState);
  };

  const handleNavigate = (screen?: string) => {
    if (screen) router.push(screen as Href);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    checkNotificationPermission().then(() => {
      console.log('Notification permission granted');
    });

    // Set up the notification handler for the app
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Handle user clicking on a notification and open the screen
    const handleNotificationClick = async (response: NotificationResponse) => {
      // TODO: Handle opening the screen from the notification
      // handleNavigate(response.notification.request.content.data?.screen);
      console.log('Notification clicked:', response);
    };

    // Listen for user clicking on a notification
    const notificationClickSubscription =
      Notifications.addNotificationResponseReceivedListener(handleNotificationClick);

    // Handle user opening the app from a notification (when the app is in the background)
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage.data?.screen);
      // TODO: Handle opening the screen from the notification
      // handleNavigate(remoteMessage.data?.screen);
    });

    // Check if the app was opened from a notification (when the app was completely quit)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          // TODO: Handle opening the screen from the notification
          // handleNavigate(remoteMessage.data?.screen);
        }
      });

    // Handle push notifications when the app is in the background
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const notification = {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data, // optional data payload
      };

      // Schedule the notification with a null trigger to show immediately
      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    });

    // Handle push notifications when the app is in the foreground
    const handlePushNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (remoteMessage.notification) {
        const notification = {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data, // optional data payload
        };

        // Schedule the notification with a null trigger to show immediately
        await Notifications.scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      }
    };

    // Listen for push notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(handlePushNotification);

    // Clean up the event listeners
    return () => {
      unsubscribe();
      notificationClickSubscription.remove();
    };
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
