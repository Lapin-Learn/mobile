import { CircleX } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

type CustomModalProps = {
  children?: React.ReactNode;
};

function CustomModal({ children }: CustomModalProps) {
  const [visible, setVisible] = useState(true);
  return (
    <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={() => {}}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-background rounded-2xl p-2 shadow-lg mx-3'>
          <View className='flex justify-end items-end'>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <CircleX size={24} color='black' />
            </TouchableOpacity>
          </View>
          <View className='my-2'>{children}</View>
        </View>
      </View>
    </Modal>
  );
}
export { CustomModal as Modal };
