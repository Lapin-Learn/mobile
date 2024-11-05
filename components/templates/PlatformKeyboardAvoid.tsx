import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

const PlatformKeyboardAvoid = ({ children }: { children: React.ReactNode }) => {
  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setAdjustPan();
    return () => {
      AvoidSoftInput.setDefaultAppSoftInputMode();
    };
  }, []);

  useFocusEffect(onFocusEffect);
  return (
    <KeyboardAvoidingView behavior='position' contentContainerStyle={styles.keyboardAvoidingView} enabled={true}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollView}
        contentInsetAdjustmentBehavior='always'
        overScrollMode='always'
        showsVerticalScrollIndicator={true}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {},
  scrollView: {
    paddingBottom: 100,
  },
});

export default PlatformKeyboardAvoid;
