import { CircleX } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

type CustomModalProps = {
  onRequestClose?: () => void;
  children?: React.ReactNode;
};

function CustomModal({ onRequestClose, children }: CustomModalProps) {
  const [visible, setVisible] = useState(true);
  return (
    <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View className='flex-1 items-center justify-center bg-black/50'>
        <View className='mx-3 rounded-2xl bg-background p-2 shadow-lg'>
          <View className='flex items-end justify-end'>
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
