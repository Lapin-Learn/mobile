import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import Spinner from '~/assets/images/spinner.svg';

export function LoadingLesson() {
  const { t } = useTranslation('lesson');
  const randomTip = Math.random() * Number(t('loading.tip.length'));
  return (
    <View className='mx-9 flex h-full flex-col items-center justify-center gap-y-8'>
      <MotiView
        from={{
          transform: [{ rotate: '0deg' }],
        }}
        animate={{
          transform: [{ rotate: '360deg' }],
        }}
        transition={{
          loop: true,
          repeatReverse: false,
          type: 'timing',
          duration: 1000,
          delay: 0,
        }}>
        <Spinner className='animate-spin' color='#EE5D28' />
      </MotiView>
      <Text className='text-center text-body font-semibold'>{t(`loading.tip.${Math.floor(randomTip)}`)}</Text>
    </View>
  );
}
