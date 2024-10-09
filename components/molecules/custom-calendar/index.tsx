import { isSameMonth, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import DayItem from './DayItem';
import { generateCalendar, parseActiveDays } from './helpers';

const LIMIT_QUERY = subMonths(new Date(), 12); // Limit to 12 months

interface CustomCalendarProps {
  onChangeMonth?: (date: Date) => void;
  activeDays?: Date[];
}

const CustomCalendar = ({ activeDays = [] }: CustomCalendarProps) => {
  const { t } = useTranslation();
  const DAYS_OF_WEEK: string[] = (t('calendar.days_of_week', { returnObjects: true }) as string[]) ?? [];
  const MONTHS: string[] = (t('calendar.months', { returnObjects: true }) as string[]) ?? [];
  const [startDay, setStartDay] = useState(new Date());

  const changeMonth = (direction: number) => {
    const newDate = new Date(startDay.setMonth(startDay.getMonth() + direction));
    setStartDay(new Date(newDate));
  };

  return (
    <View className='rounded-[8px] border border-neutral-100 p-6'>
      <View className='mb-3 flex w-full flex-row items-center justify-between'>
        <TouchableOpacity
          onPress={() => changeMonth(-1)}
          className='size-6'
          disabled={isSameMonth(startDay, LIMIT_QUERY)}>
          <ChevronLeft size={28} color='#000' />
        </TouchableOpacity>
        <Text className='font-ibold text-headline'>
          {(t('calendar.months', { returnObjects: true }) as string[])[startDay.getMonth()]} {startDay.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} className='size-6'>
          <ChevronRight size={28} color='#000' />
        </TouchableOpacity>
      </View>
      <View className='mb-3 flex w-full flex-row items-center justify-between'>
        {DAYS_OF_WEEK.map((day) => (
          <Text key={day} className='flex-1 text-center font-ibold text-headline text-neutral-300'>
            {day}
          </Text>
        ))}
      </View>
      <FlatList
        data={parseActiveDays(generateCalendar(startDay), activeDays)}
        numColumns={7}
        renderItem={({ item }) => (
          <DayItem day={item.day.getDate()} outside={item.outside} key={item.key} active={item.active} />
        )}
        ItemSeparatorComponent={() => <View className='h-3' />}
      />
    </View>
  );
};

export default CustomCalendar;
