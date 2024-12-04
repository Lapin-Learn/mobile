import i18next from '~/i18n';

import { MissionCategoryEnum } from './enums';
import { IMission } from './types';

export function convertMissionNameCategory(item: IMission) {
  const { t } = i18next;
  switch (item.category) {
    case MissionCategoryEnum.COMPLETE_LESSON_WITH_PERCENTAGE_SCORE:
      return t(`description.${item.requirements ? item.category : 'COMPLETE_LESSON'}`, {
        context: item.requirements === 100 ? 'PERFECT' : '',
        quantity: item.quantity,
        requirements: item.requirements,
        ns: 'mission',
      });
    case MissionCategoryEnum.TOTAL_DURATION_OF_LEARN_DAILY_LESSON:
      return t(`description.${item.category}`, {
        requirements: formatLearningDuration(item.requirements),
        ns: 'mission',
      });
    default:
      return t(`description.${item.category}`, {
        quantity: item.quantity,
        requirements: item.requirements,
        ns: 'mission',
      });
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
  if (time > 0) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toFixed(0).padStart(2, '0')}:${seconds.toFixed(0).padStart(2, '0')}`;
  } else {
    return '00:00';
  }
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

export const getAccurateIPA = (ipa: number[]) => {
  const accCorrectLetters = ipa.filter((letter) => letter === 1 || letter === 2).length;
  const accIncorrectLetters = ipa.filter((letter) => letter === 0).length;
  return {
    accCorrectLetters,
    accIncorrectLetters,
  };
};

export const maskEmail = (email: string) => {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart[0] + '*****' + localPart[localPart.length - 1];
  return `${maskedLocalPart}@${domain}`;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
