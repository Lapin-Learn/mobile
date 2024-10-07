import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import DayItem from './day-item';
import { generateCalendar } from './helpers';

const DAYS_OF_WEEK = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

// TODO: Implement activeDays whenever the API is ready
interface CustomCalendarProps {
  onChangeMonth?: (date: Date) => void;
  activeDays?: Date[];
}

const ACTIVE_DAYS = [new Date('2024-09-30'), new Date('2024-10-01'), new Date('2024-10-02'), new Date('2024-10-07')];

const CustomCalendar = ({}: CustomCalendarProps) => {
  const [startDay, setStartDay] = useState(new Date());

  const changeMonth = (direction: number) => {
    const newDate = new Date(startDay.setMonth(startDay.getMonth() + direction));
    setStartDay(new Date(newDate));
  };

  return (
    <View className='rounded-[8px] border border-neutral-100 p-6'>
      <View className='mb-3 flex w-full flex-row items-center justify-between'>
        <TouchableOpacity onPress={() => changeMonth(-1)} className='size-6'>
          <ChevronLeft size={28} color='#000' />
        </TouchableOpacity>
        <Text className='font-ibold text-headline'>
          {startDay.toLocaleString('default', { month: 'long' })} {startDay.getFullYear()}
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
        data={generateCalendar(startDay, ACTIVE_DAYS)}
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
