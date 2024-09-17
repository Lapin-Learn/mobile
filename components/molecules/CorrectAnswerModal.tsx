import { Link } from 'expo-router';
import { Modal, Text, View } from 'react-native';

import IconCheckmarkCircle from '~/assets/images/checkmark-circle.svg';

import { Button } from '../ui/Button';
import { AnswerModalProps } from './exercise/type';

export default function CorrectAnswerModal({ onPressContinue }: AnswerModalProps) {
  return (
    <Modal animationType='slide' transparent={true}>
      <View className='absolute bottom-0 flex w-screen justify-end gap-4 bg-green-50 px-4 pb-10 pt-4'>
        <View className='flex flex-row items-center justify-between'>
          <View className='flex flex-row items-center gap-2'>
            <IconCheckmarkCircle width={24} height={24} />
            <Text className='text-title-2 font-bold text-green-900'>Chính xác!</Text>
          </View>
          <Link href='/(map)'>
            <Text className='text-subhead text-green-700 underline'>Xem giải thích</Text>
          </Link>
        </View>
        <Button
          className='rounded-lg bg-green-600'
          onPress={() => {
            onPressContinue();
          }}>
          <Text className='text-body font-semibold text-white'>Tiếp tục</Text>
        </Button>
      </View>
    </Modal>
  );
}
