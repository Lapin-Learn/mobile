import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ProgressCircle } from '~/components/molecules/ProgressCircle';

export function LoadingLesson() {
  const loadingProgress = 0.45;
  const { t } = useTranslation('lesson');
  const randomTip = Math.random() * Number(t('loading.tip.length'));
  return (
    <View className='mx-9 flex h-full flex-col items-center justify-center gap-y-8'>
      <ProgressCircle thickness={10} size={160} strokeCap='round' progress={loadingProgress} />
      <Text className='text-center text-body font-semibold'>{t(`loading.tip.${Math.floor(randomTip)}`)}</Text>
    </View>
  );
}
