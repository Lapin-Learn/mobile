import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import i18next from '~/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLearningDuration(duration: number) {
  const { t, language: currentLanguage } = i18next;
  const hour = (duration / 3600).toFixed(1);
  const min = (duration / 60).toFixed(0);

  return duration > 3600
    ? `${hour} ${t('questionType.hour')}${currentLanguage === 'en' && parseFloat(hour) > 1 ? 's' : ''}`
    : `${min} ${t('questionType.min')}${currentLanguage === 'en' && parseFloat(min) > 1 ? 's' : ''}`;
}

/**
 * Format audio timer to MM:SS
 * @param time  - time in seconds
 * @returns formatted time in MM:SS
 */
export function formatAudioTimer(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toFixed(0).padStart(2, '0')}:${seconds.toFixed(0).padStart(2, '0')}`;
}
export const convertSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
};

export const getDuration = (startTime: Date): number => {
  const endTime = new Date();
  return Math.round(Math.abs(endTime.getTime() - startTime.getTime()) / 1000);
};
