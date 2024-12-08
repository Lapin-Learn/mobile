import { getAnalytics } from '@react-native-firebase/analytics';
import getCrashlytics from '@react-native-firebase/crashlytics';
import firestoreDatabase from '@react-native-firebase/firestore';

export const registerBackgroundService = async () => {};

export const analytics = getAnalytics();

export const crashlytics = getCrashlytics();

export const firestore = firestoreDatabase();

export type CrashlyticsPriority = 'low' | 'high' | 'max';
