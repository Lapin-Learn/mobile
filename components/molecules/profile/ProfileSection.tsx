import { createContext, FC } from 'react';
import { Text, View, ViewProps } from 'react-native';

import { cn } from '~/lib/utils';

const ProfileContext = createContext({});

export type ProfileProps = ViewProps;

const ProfileSection: FC<ProfileProps> & {
  Title: typeof Title;
  Item: typeof Item;
  Group: typeof Group;
} = ({ children, className, ...props }: ProfileProps) => {
  return (
    <ProfileContext.Provider value={{}}>
      <View className={cn('w-full flex-col gap-y-2', className)} {...props}>
        {children}
      </View>
    </ProfileContext.Provider>
  );
};

const Title: FC<ProfileProps & { label: string }> = ({ label, children }) => {
  return (
    <View className='w-full flex-row items-center justify-between'>
      <Text className='text-title-4 font-bold text-black'>{label}</Text>
      {children}
    </View>
  );
};

const Group: FC<ProfileProps & { spacer?: boolean }> = ({ children, className }) => {
  return <View className={cn('', className)}>{children}</View>;
};

const Item: FC<ProfileProps & { label?: string; value?: string }> = ({ label, value, className, children }) => {
  return (
    <View className={cn('flex flex-row justify-between', className)}>
      {label && <Text className='text-title-4 text-supporting-text'>{label}</Text>}
      {value && <Text className='text-title-4 text-neutral-900'>{value}</Text>}
      {children}
    </View>
  );
};
ProfileSection.Title = Title;
ProfileSection.Item = Item;
ProfileSection.Group = Group;

export { ProfileSection };
