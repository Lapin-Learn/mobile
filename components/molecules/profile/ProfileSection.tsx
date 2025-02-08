import { ChevronRight, LucideProps } from 'lucide-react-native';
import { FC, ForwardRefExoticComponent, createContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { StyleProps } from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';

const ProfileContext = createContext({});

export type ProfileProps = ViewProps;

const ProfileSection: FC<ProfileProps> & {
  Title: typeof Title;
  Item: typeof Item;
  Group: typeof Group;
  List: typeof List;
  ListItem: typeof ListItem;
} = ({ children, style, ...props }: ProfileProps) => {
  return (
    <ProfileContext.Provider value={{}}>
      <View style={StyleSheet.flatten([{ flexDirection: 'column', width: '100%', gap: 12 }, style])} {...props}>
        {children}
      </View>
    </ProfileContext.Provider>
  );
};

const Title: FC<ProfileProps & { label: string; textStyle?: StyleProps }> = ({ label, textStyle = {}, ...props }) => {
  return (
    <View style={StyleSheet.flatten([titleStyles.root, props.style])}>
      <Text style={StyleSheet.flatten([titleStyles.label, textStyle])}>{label}</Text>
      {props.children}
    </View>
  );
};

const titleStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...Styles.font.semibold,
    ...Styles.fontSize['title-4'],
    ...Styles.color.dark,
  },
});

const Group: FC<ProfileProps> = ({ children, style }) => (
  <View
    style={StyleSheet.flatten([
      {
        borderWidth: 1,
        ...Styles.borderColor.border,
        overflow: 'hidden',
        borderRadius: 8,
      },
      style,
    ])}>
    {children}
  </View>
);

const ListItem: FC<{
  label: string;
  onPress: () => void;
  rightIcon?: ForwardRefExoticComponent<LucideProps>;
  style?: StyleProps;
}> = ({ label, onPress, rightIcon: Icon = ChevronRight, style }) => (
  <Item style={{ ...Styles.borderColor.border }}>
    <TouchableOpacity onPress={onPress} style={[listItemStyles.root, { padding: 16 }]}>
      <Text style={[listItemStyles.label, style]}>{label}</Text>
      <Icon size={20} color='#737373' />
    </TouchableOpacity>
  </Item>
);

const listItemStyles = StyleSheet.create({
  root: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Styles.backgroundColor.white,
  },
  label: {
    ...Styles.font.medium,
    ...Styles.fontSize.callout,
  },
});
const List: FC<
  ProfileProps & {
    data?: {
      label: string;
      action: () => void;
      rightIcon?: ForwardRefExoticComponent<LucideProps>;
      style?: StyleProps;
    }[];
  }
> = ({ data, ...props }) => (
  <Group style={props.style}>
    {data?.map((item, index) => (
      <View key={index}>
        <ListItem label={item.label} onPress={item.action} rightIcon={item.rightIcon} style={item.style} />
        {index === data.length - 1 || (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: Styles.color.neutral[100].color,
            }}
          />
        )}
      </View>
    ))}
    {props.children}
  </Group>
);

const Item: FC<ProfileProps & { label?: string; value?: string }> = ({ label, value, style, children }) => (
  <View style={StyleSheet.flatten([itemStyles.root, style])}>
    {label && <Text style={itemStyles.label}>{label}</Text>}
    {value && (
      <Text style={itemStyles.value} numberOfLines={1} ellipsizeMode='tail'>
        {value}
      </Text>
    )}
    {children}
  </View>
);

const itemStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 16,
  },
  label: {
    ...Styles.font.normal,
    ...Styles.fontSize['title-4'],
    ...Styles.color.supportingText,
    width: 124,
  },
  value: {
    ...Styles.font.normal,
    ...Styles.fontSize['title-4'],
    ...Styles.color.dark,
    flex: 1,
    textAlign: 'right',
  },
});

ProfileSection.Title = Title;
ProfileSection.Item = Item;
ProfileSection.Group = Group;
ProfileSection.List = List;
ProfileSection.ListItem = ListItem;

export { ProfileSection };
