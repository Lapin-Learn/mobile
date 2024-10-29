import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

import { sendFcmToken } from '~/services/axios/notification';

export const requestPermission = async () => {
  let isGrantedNotification = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const isRequestFirstTime = (await AsyncStorage.getItem('isRequestFirstTime')) || 'true';

  if (isRequestFirstTime === 'true') {
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

const upsertToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);
  if (fcmToken) {
    await sendFcmToken({ token: fcmToken });
  }
};
