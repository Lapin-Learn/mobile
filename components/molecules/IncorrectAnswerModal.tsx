import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Modal, Text, View } from 'react-native';

import IconCrossCircle from '~/assets/images/cross-circle.svg';

import { Button } from '../ui/Button';
import { AnswerModalProps } from './exercise/types';

export default function IncorrectAnswerModal({ correctAnswer, onPressContinue }: AnswerModalProps) {
  const { t } = useTranslation('question');
  const randomEncourage = Math.random() * Number(t('general.incorrect.length'));

  return (
    <Modal animationType='slide' transparent={true}>
      <View className='absolute bottom-0 flex w-screen justify-end gap-4 bg-red-50 px-4 pb-10 pt-4'>
        <View className='flex flex-row items-center justify-between'>
          <View className='flex flex-row items-center gap-2'>
            <IconCrossCircle width={24} height={24} />
            <Text className='text-title-2 font-bold text-red-900'>
              {t(`general.incorrect.${Math.floor(randomEncourage)}`)}
            </Text>
          </View>
          <Link href='/(map)'>
            <Text className='text-subhead text-red-700 underline'>{t('general.explanation')}</Text>
          </Link>
        </View>
        <View>
          <Text className='text-body font-semibold text-neutral-900'>{t('general.correctAnswer')}</Text>
          <Text className='text-body text-neutral-900'>{correctAnswer}</Text>
        </View>
        <Button
          className='bg-red-500'
          onPress={() => {
            onPressContinue();
          }}>
          <Text className='text-body font-semibold text-white'>{t('general.continue')}</Text>
        </Button>
      </View>
    </Modal>
  );
}
