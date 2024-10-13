import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import Spinner from '~/assets/images/spinner.svg';

type LoadingProps = {
  hiddenText?: boolean;
};
export const Loading = ({ hiddenText = false }: LoadingProps) => {
  const { t } = useTranslation('lesson');
  const randomTip = Math.random() * Number(t('loading.tips.length'));
  return (
    <View className='mx-9 flex h-full flex-col items-center justify-center gap-y-8'>
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
      {!hiddenText && (
        <Text className='text-center font-isemibold text-body'>{t(`loading.tips.${Math.floor(randomTip)}`)}</Text>
      )}
    </View>
  );
};
