import { ChevronRight, LucideProps } from 'lucide-react-native';
import { FC, ForwardRefExoticComponent, createContext } from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';

import { cn } from '~/lib/utils';

const ProfileContext = createContext({});

export type ProfileProps = ViewProps;

const ProfileSection: FC<ProfileProps> & {
  Title: typeof Title;
  Item: typeof Item;
  Group: typeof Group;
  List: typeof List;
  ListItem: typeof ListItem;
} = ({ children, className, ...props }: ProfileProps) => {
  return (
    <ProfileContext.Provider value={{}}>
      <View className={cn('w-full flex-col gap-y-2', className)} {...props}>
        {children}
      </View>
    </ProfileContext.Provider>
  );
};

const Title: FC<ProfileProps & { label: string }> = ({ label, children }) => (
  <View className='w-full flex-row items-center justify-between'>
    <Text className='text-title-4 font-bold text-black'>{label}</Text>
    {children}
  </View>
);

const Group: FC<ProfileProps> = ({ children, className }) => <View className={cn('', className)}>{children}</View>;

const ListItem: FC<{
  label: string;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  rightIcon?: ForwardRefExoticComponent<LucideProps>;
}> = ({ label, onPress, isFirst, isLast, rightIcon: Icon = ChevronRight }) => (
  <Item
    className={cn('border border-t-0 border-neutral-100 p-4', isFirst && 'rounded-t border-t', isLast && 'rounded-b')}>
    <TouchableOpacity onPress={onPress} className='w-full flex-row items-center justify-between'>
      <Text className='text-body font-semibold'>{label}</Text>
      <Icon size={24} color={'#737373'} />
    </TouchableOpacity>
  </Item>
);

const List: FC<{
  data: { label: string; action: () => void }[];
  className?: string;
  rightIcon?: ForwardRefExoticComponent<LucideProps>;
}> = ({ data, className, rightIcon }) => (
  <Group className={cn('', className)}>
    {data.map((item, index) => (
      <ListItem
        key={index}
        label={item.label}
        onPress={item.action}
        isFirst={index === 0}
        isLast={index === data.length - 1}
        rightIcon={rightIcon}
      />
    ))}
  </Group>
);

const Item: FC<ProfileProps & { label?: string; value?: string }> = ({ label, value, className, children }) => (
  <View className={cn('flex flex-row justify-between', className)}>
    {label && <Text className='text-title-4 text-supporting-text'>{label}</Text>}
    {value && <Text className='text-title-4 text-neutral-900'>{value}</Text>}
    {children}
  </View>
);

ProfileSection.Title = Title;
ProfileSection.Item = Item;
ProfileSection.Group = Group;
ProfileSection.List = List;
ProfileSection.ListItem = ListItem;

export { ProfileSection };
