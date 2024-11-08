import { IMission } from '~/lib/types';

export type MissionProps = IMission;

export type MissionSectionProps = {
  title?: string;
  timeRemaining?: number;
  missions: IMission[];
};
