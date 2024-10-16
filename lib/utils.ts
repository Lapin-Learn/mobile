import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import i18next from '~/i18n';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function convertMissionNameCategory(interval: string, name: string) {
  const { t } = i18next;
  const convertToLowerCaseAndContainUnderscore = name.toLowerCase().trimStart().replace(/ /g, '_');
  const getPercentage = convertToLowerCaseAndContainUnderscore.split('_').pop();
  if (isNaN(parseInt(getPercentage ?? '')))
    return t(`${interval}.${convertToLowerCaseAndContainUnderscore}`, { ns: 'mission' });
  else {
    const getName = convertToLowerCaseAndContainUnderscore.split('_').slice(0, -1).join('_');
    return t(`${interval}.${getName}`, { percentage: getPercentage, ns: 'mission' });
  }
}

export function formatUnit(value: number, unit: string) {
  const { t, language: currentLanguage } = i18next;

  return `${value} ${t(`time_units.${unit}`)}${currentLanguage === 'en' && value > 1 ? 's' : ''}`;
}

export function formatRemainingToDateTime(remainingTime: number) {
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  if (days > 0) return formatUnit(days, 'day');
  if (hours > 0) return formatUnit(hours, 'hour');
  if (minutes > 0) return formatUnit(minutes, 'minute');
  return formatUnit(seconds, 'second');
}

export const formatLearningDuration = (duration: number) => {
  const hour = (duration / 3600).toFixed(1);
  const min = (duration / 60).toFixed(0);

  return duration > 3600 ? formatUnit(parseFloat(hour), 'hour') : formatUnit(parseFloat(min), 'minute');
};

/**
 * Format audio timer to MM:SS
 * @param time  - time in seconds
 * @returns formatted time in MM:SS
 */
export const formatAudioTimer = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toFixed(0).padStart(2, '0')}:${seconds.toFixed(0).padStart(2, '0')}`;
};

export const formatNumber = (num: number) => {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (Math.floor(num / 100) / 10).toFixed(1) + 'K';
  } else if (num < 1000000000) {
    return (Math.floor(num / 100000) / 10).toFixed(1) + 'M';
  } else {
    return (Math.floor(num / 100000000) / 10).toFixed(1) + 'B';
  }
};

export const convertSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
};

export const getDuration = (startTime: number): number => {
  const endTime = new Date().getTime();
  return Math.round(Math.abs(endTime - startTime) / 1000);
};
