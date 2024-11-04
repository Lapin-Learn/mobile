import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

const PasswordInput = ({ style, ...props }: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.root}>
      <TextInput style={StyleSheet.flatten([styles.input, style])} {...props} secureTextEntry={!showPassword} />
      <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
        {!showPassword ? <EyeIcon size={24} color='#b4b4b4' /> : <EyeOffIcon size={24} color='#b4b4b4' />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.borderColor.neutral[200],
    backgroundColor: 'white',
    padding: 12,
    ...Styles.font.medium,
    ...Styles.fontSize.subhead,
  },
  toggleButton: {
    position: 'absolute',
    right: 3,
    justifyContent: 'center',
  },
});
export default PasswordInput;
