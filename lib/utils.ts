import { clsx, type ClassValue } from 'clsx';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import i18next from '~/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLearningDuration(duration: number) {
  const { t } = useTranslation('translation');
  const currentLanguage = i18next.language;
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
