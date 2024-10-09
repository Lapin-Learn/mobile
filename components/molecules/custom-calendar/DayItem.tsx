import { cva, VariantProps } from 'class-variance-authority';
import { Text, View } from 'react-native';

import { cn } from '~/lib/utils';

const textDayVariants = cva('text-center font-ibold text-headline', {
  variants: {
    variant: {
      default: 'text-dark',
      active: 'text-orange-700',
    },
    outside: {
      false: 'opacity-100',
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'default',
    outside: false,
  },
});

const containerDayVariants = cva('flex size-9 flex-row items-center justify-center', {
  variants: {
    active: {
      default: 'rounded-none',
      first: 'rounded-l-full bg-[#FCE3B4]',
      last: 'rounded-r-full bg-[#FCE3B4]',
      middle: 'bg-[#FCE3B4]',
      single: 'rounded-full bg-[#FCE3B4]',
    },
  },
  defaultVariants: {
    active: 'default',
  },
});

export interface DayItemProps extends VariantProps<typeof textDayVariants>, VariantProps<typeof containerDayVariants> {
  day: number;
}
export default function DayItem({ day, outside, active }: DayItemProps) {
  return (
    <View className={cn('flex h-9 flex-1 flex-row items-center justify-center', '')}>
      <View
        className={cn(
          'h-full w-full flex-1',
          !['first', 'single', 'default'].includes(active as string) ? 'bg-[#FCE3B4]' : ''
        )}
      />
      <View className={containerDayVariants({ active })}>
        <Text className={textDayVariants({ variant: active === 'default' ? 'default' : 'active', outside })}>
          {day}
        </Text>
      </View>
      <View
        className={cn(
          'h-full w-full flex-1',
          !['last', 'single', 'default'].includes(active as string) ? 'bg-[#FCE3B4]' : ''
        )}
      />
    </View>
  );
}
