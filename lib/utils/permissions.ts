import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

import { sendFcmToken } from '~/services/axios/notification';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const getFcmTokenWithRetry = async (retries = 0): Promise<string | null> => {
  try {
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    if ((error as { code: string }).code === 'messaging/unknown' && retries < MAX_RETRIES) {
      console.log(`Retrying to get FCM token... (${retries + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return getFcmTokenWithRetry(retries + 1);
    }
    return null;
  }
};

export const requestPermission = async () => {
  let isGrantedNotification = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  if (!isGrantedNotification) {
    const permissionAppGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    await AsyncStorage.setItem('isRequestFirstTime', 'false');
    if (permissionAppGranted === PermissionsAndroid.RESULTS.GRANTED) {
      isGrantedNotification = true;
    } else {
      isGrantedNotification = false;
    }
  }

  if (isGrantedNotification === true) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await upsertToken();
    }
  }

  return isGrantedNotification;
};

export const requestPermissionIOS = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    await upsertToken();
  }

  return enabled;
};

const upsertToken = async () => {
  try {
    const fcmToken = await getFcmTokenWithRetry();
    if (fcmToken) {
      await sendFcmToken({ token: fcmToken });
    } else {
      console.log('Failed to get FCM token after retries');
    }
  } catch (error) {
    console.error(error);
  }
};
