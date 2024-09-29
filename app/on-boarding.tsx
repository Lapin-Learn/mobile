import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { LucideMoveRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import Onboarding from '~/assets/images/on-boarding.svg';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';
import { FIRST_LAUNCH } from '~/services';

export default function OnBoarding() {
  const { t } = useTranslation();
  const handleSkip = async () => {
    await SecureStore.setItemAsync(FIRST_LAUNCH, 'false');
    router.push('/auth/sign-in');
  };

  const handleGetStart = async () => {
    await SecureStore.setItemAsync(FIRST_LAUNCH, 'false');
    router.push('/auth/sign-up');
  };

  return (
    <View className={cn('h-full items-center justify-between pb-4')}>
      <View className='h-[444px] w-full items-center justify-start'>
        <Onboarding />
      </View>
      <NavigationBar noBar={true} title={t('on_boarding.title')} className='w-full'>
        <Text className='text-body text-supporting-text'>{t('on_boarding.description')}</Text>
      </NavigationBar>
      <View className='w-full gap-y-2 px-4'>
        <Button className='flex-row items-center justify-center gap-x-1 px-4 py-3.5' onPress={handleGetStart}>
          <Text className='text-body font-semibold text-white'>{t('on_boarding.get_start')}</Text>
          <LucideMoveRight color={'white'} />
        </Button>
        <Button className='bg-white' onPress={handleSkip}>
          <Text className='text-body font-semibold text-neutral-300'>{t('on_boarding.skip')}</Text>
        </Button>
      </View>
    </View>
  );
}