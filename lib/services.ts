import { getAnalytics } from '@react-native-firebase/analytics';
import getCrashlytics from '@react-native-firebase/crashlytics';

export const registerBackgroundService = async () => {};

export const analytics = getAnalytics();

export const crashlytics = getCrashlytics();

export type CrashlyticsPriority = 'low' | 'high' | 'max';
