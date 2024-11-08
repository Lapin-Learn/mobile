import { CircleX } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

type CustomModalProps = {
  visible?: boolean;
  onRequestClose?: () => void;
  position?: 'center' | 'bottom';
  children: React.ReactNode;
};

const CustomModal = ({ visible = false, onRequestClose, children, position = 'center' }: CustomModalProps) => {
  const [isVisible, setIsVisible] = useState(visible);
  const translateY = useRef(new Animated.Value(300)).current;

  const slideIn = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      slideIn();
    } else {
      slideOut();
    }
  }, [visible]);

  const handleRequestClose = () => {
    if (onRequestClose) {
      onRequestClose();
    } else {
      setIsVisible(false);
    }
  };

  const exitButton = (
    <View style={styles.exitButtonContainer}>
      <TouchableOpacity onPress={handleRequestClose}>
        <CircleX size={24} color='black' />
      </TouchableOpacity>
    </View>
  );

  const animatedStyle = {
    transform: [{ translateY }],
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={animatedStyle}>
      {position === 'center' ? exitButton : null}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  exitButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export { CustomModal };
