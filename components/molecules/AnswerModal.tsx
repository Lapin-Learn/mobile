import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Modal, Text, View } from 'react-native';

import IconCheckmarkCircle from '~/assets/images/checkmark-circle.svg';
import IconCrossCircle from '~/assets/images/cross-circle.svg';

import { Button } from '../ui/Button';

export type AnswerModalProps = {
  modalType: 'correct' | 'incorrect';
  correctAnswer?: string | null;
  correctAnswers?: string[] | null;
  explanation?: string | null;
  onPressContinue: () => void;
};

export default function AnswerModal({ modalType, correctAnswers, onPressContinue }: AnswerModalProps) {
  const { t } = useTranslation('question');
  const randomEncourage =
    modalType === 'correct'
      ? Math.random() * Number(t('general.correct.length'))
      : Math.random() * Number(t('general.incorrect.length'));

  return (
    <Modal animationType='slide' transparent={true}>
      <View
        className={`absolute bottom-0 flex w-screen justify-end gap-4 ${modalType === 'correct' ? 'bg-green-50' : 'bg-red-50'} px-4 pb-10 pt-4`}>
        <View className='flex flex-row items-center justify-between'>
          {modalType === 'correct' ? (
            <View className='flex flex-row items-center gap-2'>
              <IconCheckmarkCircle width={24} height={24} />
              <Text className='text-title-2 font-bold text-green-900'>
                {t(`general.correct.${Math.floor(randomEncourage)}`)}
              </Text>
            </View>
          ) : (
            <View className='flex flex-row items-center gap-2'>
              <IconCrossCircle width={24} height={24} />
              <Text className='text-title-2 font-bold text-red-900'>
                {t(`general.incorrect.${Math.floor(randomEncourage)}`)}
              </Text>
            </View>
          )}
          <Link href='/(map)'>
            <Text className={`text-subhead ${modalType === 'correct' ? 'text-green-700' : 'text-red-700'} underline`}>
              {t('general.explanation')}
            </Text>
          </Link>
        </View>
        {modalType === 'incorrect' && correctAnswers && correctAnswers.length > 0 && (
          <View>
            <Text className='text-body font-semibold text-neutral-900'>{t('general.correctAnswer')}</Text>
            {correctAnswers?.map((answer, index) => (
              <Text key={index} className='text-body text-neutral-900'>
                {`\u2022 ${answer}`}
              </Text>
            ))}
          </View>
        )}
        <Button className={`${modalType === 'correct' ? 'bg-green-500' : 'bg-red-500'}`} onPress={onPressContinue}>
          <Text className='text-body font-semibold text-white'>{t('general.continue')}</Text>
        </Button>
      </View>
    </Modal>
  );
}
