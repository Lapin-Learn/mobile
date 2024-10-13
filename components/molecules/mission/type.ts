export type MissionProps = {
  code: string;
  value: string;
  current: string;
  target: string;
};

export type MissionsProps = {
  type: 'daily' | 'monthly';
  timestamp: string;
  data: MissionProps[];
};
