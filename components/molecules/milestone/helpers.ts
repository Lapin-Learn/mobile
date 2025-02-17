import { getFreezeDays } from '~/components/molecules/custom-calendar/helpers';
import { IStreakHistory } from '~/lib/types';

const formatDate = (date: Date) => {
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
};

const getCurrentWeekBooleanObject = (doneRecords: IStreakHistory[], dayNames: string[]) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay); // Set to the start of the week (Sunday)

  const weekBooleanObject: Record<string, boolean | 'freeze' | undefined> = {};
  const freezeDays = getFreezeDays(doneRecords);
  const doneRecordsSet = new Set(doneRecords.map((record) => formatDate(new Date(record.date))));

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    const formattedDate = formatDate(weekDate);
    if (weekDate > currentDate) {
      weekBooleanObject[dayNames[i]] = undefined;
    } else {
      weekBooleanObject[dayNames[i]] = freezeDays.includes(weekDate.toDateString())
        ? 'freeze'
        : doneRecordsSet.has(formattedDate);
    }
  }

  return weekBooleanObject;
};

export { formatDate, getCurrentWeekBooleanObject };
