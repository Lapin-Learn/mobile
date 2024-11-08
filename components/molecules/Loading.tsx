import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import Spinner from '~/assets/images/spinner.svg';
import Styles from '~/constants/GlobalStyles';

type LoadingProps = {
  hiddenText?: boolean;
};
export const Loading = ({ hiddenText = false }: LoadingProps) => {
  const { t } = useTranslation('lesson');
  const randomTip = Math.random() * Number(t('loading.tips.length'));
  return (
    <View style={styles.root}>
      <MotiView
        from={{
          rotate: '0deg',
        }}
        animate={{
          rotate: '360deg',
        }}
        transition={{
          loop: true,
          repeatReverse: false,
          type: 'timing',
          easing: Easing.linear,
          duration: 2000,
        }}>
        <Spinner />
      </MotiView>
      {!hiddenText && <Text style={styles.text}>{t(`loading.tips.${Math.floor(randomTip)}`)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 32,
    marginHorizontal: 36,
  },
  text: {
    textAlign: 'center',
    ...Styles.fontSize.body,
    ...Styles.font.semibold,
  },
});
