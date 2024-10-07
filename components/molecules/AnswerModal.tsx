import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import IconCheckmarkCircle from '~/assets/images/checkmark-circle.svg';
import IconCrossCircle from '~/assets/images/cross-circle.svg';
import { cn } from '~/lib/utils';

import { Button } from '../ui/Button';

export type AnswerModalProps = {
  modalType: 'correct' | 'incorrect';
  correctAnswer?: string | null;
  correctAnswers?: string[] | null;
  onPressContinue: () => void;
};

export default function AnswerModal({ modalType, correctAnswers, onPressContinue }: AnswerModalProps) {
  const [randomEncourage, setRandomEncourage] = useState<number>(0);
  const [showModal, setShowModal] = useState(true);
  const { t } = useTranslation('question');

  useEffect(() => {
    const randomValue =
      modalType === 'correct'
        ? Math.random() * Number(t('general.correct.length'))
        : Math.random() * Number(t('general.incorrect.length'));
    setRandomEncourage(randomValue);
  }, [modalType, onPressContinue]);

  // Ensure modal is shown when navigating back to the page
  useFocusEffect(
    useCallback(() => {
      if (!showModal) {
        setShowModal(true);
      }
    }, [showModal])
  );

  return (
    <Modal animationType='slide' transparent={true} visible={showModal} onRequestClose={onPressContinue}>
      <View
        className={cn(
          'absolute bottom-0 flex w-screen justify-end gap-4 px-4 pb-10 pt-4',
          modalType === 'correct' ? 'bg-green-50' : 'bg-red-50'
        )}>
        <View className='flex flex-row items-center justify-between'>
          {modalType === 'correct' ? (
            <View className='flex flex-row items-center gap-2'>
              <IconCheckmarkCircle width={24} height={24} />
              <Text className='font-ibold text-title-2 text-green-900'>
                {t(`general.correct.${Math.floor(randomEncourage)}`)}
              </Text>
            </View>
          ) : (
            <View className='flex flex-row items-center gap-2'>
              <IconCrossCircle width={24} height={24} />
              <Text className='font-ibold text-title-2 text-red-900'>
                {t(`general.incorrect.${Math.floor(randomEncourage)}`)}
              </Text>
            </View>
          )}
          <Pressable
            onPress={() => {
              // Close modal and navigate to explanation page
              if (setShowModal) setShowModal(false);
              router.push('/lesson/explanation');
            }}>
            <Text className={cn('text-subhead underline', modalType === 'correct' ? 'text-green-700' : 'text-red-700')}>
              {t('general.explanation')}
            </Text>
          </Pressable>
        </View>
        {modalType === 'incorrect' && correctAnswers && correctAnswers.length > 0 && (
          <View>
            <Text className='font-isemibold text-body text-neutral-900'>{t('general.correctAnswer')}</Text>
            {correctAnswers?.map((answer, index) => (
              <Text key={index} className='text-body text-neutral-900'>
                {`\u2022 ${answer}`}
              </Text>
            ))}
          </View>
        )}
        <Button className={`${modalType === 'correct' ? 'bg-green-500' : 'bg-red-500'}`} onPress={onPressContinue}>
          <Text className='text-button'>{t('general.continue')}</Text>
        </Button>
      </View>
    </Modal>
  );
}
