import { StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

export type DayItemProps = {
  outside?: boolean;
  active?: 'default' | 'single' | 'last' | 'middle' | 'first';
  day: number;
  today?: boolean;
  freeze: boolean;
};
const DayItem = ({ day, outside = false, active = 'default', today = false, freeze = false }: DayItemProps) => {
  return (
    <View style={StyleSheet.flatten([styles.container])}>
      <View
        style={StyleSheet.flatten([
          styles.dayItem,
          !['first', 'single', 'default'].includes(active as string) ? styles.activeBackground : {},
        ])}
      />
      <View
        style={StyleSheet.flatten([
          containerDayVariantStyles.root,
          today ? styles.today : {},
          containerDayVariantStyles[active],
          freeze ? styles.freeze : {},
        ])}>
        <Text
          style={StyleSheet.flatten([
            textDayVariantsStyles.root,
            today ? textDayVariantsStyles.today : {},
            textDayVariantsStyles[active === 'default' ? 'default' : 'active'],
            textDayVariantsStyles[outside ? 'outside' : 'inside'],
            freeze ? textDayVariantsStyles.freeze : {},
          ])}>
          {day}
        </Text>
      </View>
      <View
        style={StyleSheet.flatten([
          styles.dayItem,
          !['last', 'single', 'default'].includes(active as string) ? styles.activeBackground : {},
        ])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 36,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayItem: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  activeBackground: {
    backgroundColor: '#FCE3B4',
  },
  today: {
    borderRadius: 9999,
    backgroundColor: Styles.color.neutral[200].color,
  },
  freeze: {
    borderRadius: 9999,
    backgroundColor: Styles.color.blue[200].color,
  },
});

const textDayVariantsStyles = StyleSheet.create({
  root: {
    ...Styles.font.bold,
    ...Styles.fontSize.headline,
    alignItems: 'center',
    color: Styles.color.dark.color,
  },
  outside: {
    opacity: 0.5,
  },
  inside: {
    opacity: 1,
  },
  default: {},
  active: {
    color: Styles.color.orange[700].color,
  },
  today: {
    color: Styles.color.white.color,
  },
  freeze: {
    color: Styles.color.blue[700].color,
  },
});

const containerDayVariantStyles = StyleSheet.create({
  root: {
    height: 36,
    width: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {},
  first: {
    borderTopLeftRadius: 9999,
    borderBottomLeftRadius: 9999,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    ...styles.activeBackground,
  },
  last: {
    borderTopRightRadius: 9999,
    borderBottomRightRadius: 9999,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    ...styles.activeBackground,
  },
  middle: {
    ...styles.activeBackground,
  },
  single: {
    borderRadius: 9999,
    ...styles.activeBackground,
  },
});

export default DayItem;
