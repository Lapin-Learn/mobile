import { StyleSheet } from 'react-native';

import Styles from '~/constants/GlobalStyles';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  text: {
    ...Styles.fontSize['title-4'],
    ...Styles.font.bold,
    ...Styles.color.orange[500],
  },
  broken: {
    ...Styles.color.neutral[300],
  },
});
