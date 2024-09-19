import { Carrot, Sparkles, Star } from 'lucide-react-native';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');

const confettiColors = ['#D194C2', '#ff5e7e', '#AACC66', '#FFFF33', '#70C299', '#E963D2'];
const confettiShapes = [Carrot, Star, Sparkles];

const ConfettiShape = ({ index }: { index: number }) => {
  const Component = confettiShapes[index % confettiShapes.length];
  return (
    <Component
      color={confettiColors[index % confettiColors.length]}
      fill={confettiColors[index % confettiColors.length]}
    />
  );
};

const ConfettiPiece = ({ index }: { index: number }) => {
  const translateY = useSharedValue(height - 100); // Start at bottom of the screen
  const translateX = useSharedValue(0); // Start at the center horizontally
  const randomXOffset = Math.random() * width - width / 2; // Random X offset
  const burstHeight = Math.random() * 0.5 * height - height / 2 - 200; // Random burst height
  const rotate = useSharedValue(Math.random() * 360); // For controlling rotation

  const confettiStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value }, // Apply X-axis movement
        { rotate: `${rotate.value}deg` }, // Apply slower rotation
      ],
    };
  });

  useEffect(() => {
    // Animate upward burst and falling with gravity
    translateY.value = withTiming(
      burstHeight,
      {
        duration: 500 + Math.random() * 200, // Fast upward burst
        easing: Easing.out(Easing.exp),
      },
      () => {
        // After burst, fall back down with gravity
        translateY.value = withTiming(height + 50, {
          duration: 1000 + Math.random() * 2000, // Slower fall
          easing: Easing.in(Easing.cubic),
        });
      }
    );

    // Animate horizontal movement (random X offset)
    translateX.value = withTiming(
      translateX.value + randomXOffset,
      {
        duration: 800 + Math.random() * 200, // Burst to a random X position
        easing: Easing.out(Easing.exp),
      },
      () => {
        // Continue falling with the same X position
        translateX.value = withTiming(translateX.value, {
          duration: 3000 + Math.random() * 2000,
          easing: Easing.in(Easing.cubic),
        });
      }
    );

    // Slow rotation for the confetti piece
    rotate.value = withTiming(360, {
      duration: 1000 + Math.random() * 2000, // Slow rotation for 5 seconds or more
      easing: Easing.linear,
    });
  }, []);

  return (
    <Animated.View style={[styles.confettiPiece, confettiStyle]}>
      <ConfettiShape index={index} />
    </Animated.View>
  );
};

const Confetti = () => {
  const confettiPieces = Array(100).fill(0);

  return (
    <View style={styles.container}>
      {confettiPieces.map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 20,
    borderRadius: 2,
  },
});

Confetti.displayName = 'Confetti';

export default Confetti;
