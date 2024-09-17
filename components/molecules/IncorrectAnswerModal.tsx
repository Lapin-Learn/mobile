import { Link } from 'expo-router';
import { Modal, Text, View } from 'react-native';

import IconCrossCircle from '~/assets/images/cross-circle.svg';

import { Button } from '../ui/Button';
import { AnswerModalProps } from './exercise/type';

export default function IncorrectAnswerModal({ correctAnswer, onPressContinue }: AnswerModalProps) {
  return (
    <Modal animationType='slide' transparent={true}>
      <View className='absolute bottom-0 flex w-screen justify-end gap-4 bg-red-50 px-4 pb-10 pt-4'>
        <View className='flex flex-row items-center justify-between'>
          <View className='flex flex-row items-center gap-2'>
            <IconCrossCircle width={24} height={24} />
            <Text className='text-title-2 font-bold text-red-900'>Sai rồi!</Text>
          </View>
          <Link href='/(map)'>
            <Text className='text-subhead text-red-700 underline'>Xem giải thích</Text>
          </Link>
        </View>
        <View>
          <Text className='text-body font-semibold text-neutral-900'>Câu trả lời đúng là:</Text>
          <Text className='text-body text-neutral-900'>{correctAnswer}</Text>
        </View>
        <Button
          className='rounded-lg bg-red-500'
          onPress={() => {
            onPressContinue();
          }}>
          <Text className='text-body font-semibold text-white'>Tiếp tục</Text>
        </Button>
      </View>
    </Modal>
  );
}
