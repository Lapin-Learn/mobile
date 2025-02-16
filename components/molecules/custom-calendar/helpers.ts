import { addDays, isBefore, isSameDay, subDays } from 'date-fns';

import { ActionNameEnum } from '~/lib/enums';
import { IStreakHistory } from '~/lib/types';

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

type DayProps = {
  key: string;
  day: Date;
  outside: boolean;
  active: 'default' | 'single' | 'last' | 'middle' | 'first';
};

const generateCalendar = (startDay: Date) => {
  const year = startDay.getFullYear();
  const month = startDay.getMonth();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysArray: DayProps[] = [];
  const lastMonthDays: DayProps[] = [];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = new Date(prevMonthYear, prevMonth, daysInPrevMonth - i, 0, 0, 0, 0);
    lastMonthDays.push({
      key: `prev-${i}`,
      day,
      outside: true,
      active: 'default',
    });
  }

  daysArray.push(...lastMonthDays);
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(year, month, i, 0, 0, 0, 0);
    daysArray.push({
      key: `day-${i}`,
      day,
      outside: false,
      active: 'default',
    });
  }

  const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
  for (let i = 1; i <= 6 - lastDayOfMonth; i++) {
    const day = new Date(nextMonthYear, nextMonth, i, 0, 0, 0, 0);
    daysArray.push({
      key: `next-${i}`,
      day,
      outside: true,
      active: 'default',
    });
  }

  return daysArray;
};

const parseActiveDays = (originalDays: DayProps[], activeDays: Date[] = []) => {
  activeDays.sort((a, b) => a.getTime() - b.getTime());
  activeDays = Array.from(new Set(activeDays.map((d) => d.getTime()))).map((time) => new Date(time));
  const newDays = [...originalDays];
  let i = 0;
  let j = 0;
  while (i < activeDays.length) {
    if (isBefore(activeDays[i], originalDays[0].day)) {
      i++;
    } else break;
  }
  while (j < originalDays.length) {
    if (i > activeDays.length - 1) break;
    if (isSameDay(originalDays[j].day, activeDays[i])) {
      newDays[j].active = 'single';
      if (i > 0 && isSameDay(subDays(originalDays[j].day, 1), activeDays[i - 1])) {
        newDays[j].active = 'last';
        if (i < activeDays.length - 1 && isSameDay(addDays(originalDays[j].day, 1), activeDays[i + 1])) {
          newDays[j].active = 'middle';
        }
      } else if (i < activeDays.length - 1 && isSameDay(addDays(originalDays[j].day, 1), activeDays[i + 1])) {
        newDays[j].active = 'first';
      }
      i++;
    }
    j++;
  }
  return newDays;
};

const getFreezeDays = (days: IStreakHistory[]) =>
  days
    .filter((day) => day.actionName === ActionNameEnum.FREEZE_STREAK)
    .map((day) => {
      const date = new Date(day.date);
      date.setDate(date.getDate() - 1);

      return date.toDateString();
    });

export { generateCalendar, getFreezeDays, parseActiveDays };
