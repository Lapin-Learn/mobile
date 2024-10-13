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

const Title: FC<ProfileProps & { label: string; textClassName?: string }> = ({ label, textClassName, ...props }) => {
  return (
    <View className={cn('w-full flex-row items-center justify-between', props.className)}>
      <Text className={`font-ibold text-black ${textClassName}`}>{label}</Text>
      {props.children}
    </View>
  );
};

const Group: FC<ProfileProps> = ({ children, className }) => (
  <View className={cn('overflow-hidden rounded border border-neutral-100', className)}>{children}</View>
);

const ListItem: FC<{
  label: string;
  onPress: () => void;
  rightIcon?: ForwardRefExoticComponent<LucideProps>;
}> = ({ label, onPress, rightIcon: Icon = ChevronRight }) => (
  <Item className={cn('border-neutral-100 p-4')}>
    <TouchableOpacity onPress={onPress} className='w-full flex-row items-center justify-between'>
      <Text className='font-isemibold text-body'>{label}</Text>
      <Icon size={24} color={'#737373'} />
    </TouchableOpacity>
  </Item>
);

const List: FC<
  ProfileProps & {
    data?: { label: string; action: () => void }[];
    rightIcon?: ForwardRefExoticComponent<LucideProps>;
  }
> = ({ data, rightIcon, ...props }) => (
  <Group className={props.className}>
    {data?.map((item, index) => (
      <View key={index}>
        <ListItem label={item.label} onPress={item.action} rightIcon={rightIcon} />
        {index === data.length - 1 || <View className='border-t border-neutral-100' />}
      </View>
    ))}
    {props.children}
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
