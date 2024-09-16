import { CircleX } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

import { cn } from '~/lib/utils';

type CustomModalProps = {
  onRequestClose?: () => void;
  children?: React.ReactNode;
  position?: 'center' | 'bottom';
};

function CustomModal({ onRequestClose, children, position = 'center' }: CustomModalProps) {
  const [visible, setVisible] = useState(true);
  const exitButton = (
    <View className='flex items-end justify-end'>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <CircleX size={24} color='black' />
      </TouchableOpacity>
    </View>
  );
  return (
    <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View className={cn('flex-1', position === 'center' ? 'items-center justify-center bg-black/50' : 'justify-end')}>
        <View
          className={cn(
            'bg-background p-2 shadow-lg',
            position === 'center' ? 'mx-3 rounded-2xl' : 'rounded-t-4xl px-4'
          )}>
          {position === 'center' ? exitButton : null}
          <View className='my-2'>{children}</View>
        </View>
      </View>
    </Modal>
  );
}
export { CustomModal as Modal };
