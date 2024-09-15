import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLearningDuration(duration: number) {
  return duration > 3600 ? `${(duration / 3600).toFixed(1)} giờ` : `${(duration / 60).toFixed(0)} phút`;
}
