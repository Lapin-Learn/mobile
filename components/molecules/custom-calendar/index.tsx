import { isSameDay, isSameMonth, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import DayItem from './DayItem';
import { generateCalendar, parseActiveDays } from './helpers';

const LIMIT_QUERY = subMonths(new Date(), 12); // Limit to 12 months

type CustomCalendarProps = {
  onChangeMonth?: (date: Date) => void;
  activeDays?: Date[];
  freezeDays: string[];
};

const CustomCalendar = ({ activeDays = [], freezeDays }: CustomCalendarProps) => {
  const { t } = useTranslation();
  const DAYS_OF_WEEK: string[] = (t('calendar.days_of_week', { returnObjects: true }) as string[]) ?? [];
  const MONTHS: string[] = (t('calendar.months', { returnObjects: true }) as string[]) ?? [];
  const [startDay, setStartDay] = useState(new Date());

  const changeMonth = (direction: number) => {
    const newDate = new Date(startDay.setMonth(startDay.getMonth() + direction));
    setStartDay(new Date(newDate));
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarRow}>
        <TouchableOpacity
          onPress={() => changeMonth(-1)}
          style={styles.navigationButton}
          disabled={isSameMonth(startDay, LIMIT_QUERY)}>
          <ChevronLeft size={28} color='#000' />
        </TouchableOpacity>
        <Text style={styles.navigationMonth}>
          {MONTHS[startDay.getMonth()]} {startDay.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navigationButton}>
          <ChevronRight size={28} color='#000' />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarRow}>
        {DAYS_OF_WEEK.map((day) => (
          <Text key={day} style={styles.daysOfWeek}>
            {day}
          </Text>
        ))}
      </View>
      <FlatList
        data={parseActiveDays(generateCalendar(startDay), activeDays)}
        numColumns={7}
        renderItem={({ item }) => (
          <DayItem
            day={item.day.getDate()}
            outside={item.outside}
            key={item.key}
            active={item.active}
            today={isSameDay(new Date(), item.day)}
            freeze={freezeDays.includes(item.day.toDateString())}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  daysOfWeek: {
    flex: 1,
    textAlign: 'center',
    ...Styles.font.bold,
    ...Styles.fontSize.headline,
    color: Styles.color.neutral[300].color,
  },
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Styles.color.neutral[100].color,
    padding: 16,
  },
  navigationButton: {
    width: 24,
    height: 24,
  },
  navigationMonth: {
    ...Styles.font.bold,
    ...Styles.fontSize.headline,
  },
});

export default CustomCalendar;
