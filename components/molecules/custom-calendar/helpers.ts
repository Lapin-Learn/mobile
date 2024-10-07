const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

type DayProps = {
  key: string;
  day: Date;
  outside: boolean;
  active: 'default' | 'single' | 'last' | 'middle' | 'first';
};

const generateCalendar = (startDay: Date, activeDays: Date[] = []) => {
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

  for (let i = 0; i < daysArray.length; i += 1) {
    const isActive = activeDays.findIndex((activeDay) => activeDay.toDateString() === daysArray[i].day.toDateString());
    if (isActive !== -1) {
      daysArray[i].active = 'single';
    }
  }
  return daysArray;
};

export { generateCalendar };
