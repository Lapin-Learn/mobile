function formatDate(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

function getCurrentWeekBooleanObject(doneRecords: string[], dayNames: string[]): Record<string, boolean | undefined> {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay); // Set to the start of the week (Sunday)

  const weekBooleanObject: Record<string, boolean | undefined> = {};
  const doneRecordsSet = new Set(doneRecords.map((record) => formatDate(new Date(record))));

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    const formattedDate = formatDate(weekDate);
    if (weekDate > currentDate) {
      weekBooleanObject[dayNames[i]] = undefined;
    } else {
      weekBooleanObject[dayNames[i]] = doneRecordsSet.has(formattedDate);
    }
  }

  return weekBooleanObject;
}

export { formatDate, getCurrentWeekBooleanObject };
