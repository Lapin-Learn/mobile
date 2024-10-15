export type MissionProps = {
  interval: 'daily' | 'monthly';
  name: string;
  description?: string;
  value: number;
  current: number;
  quantity: number;
};
