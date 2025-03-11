import { Platform, StyleSheet, TextInput, TextInputProps } from 'react-native';

import Styles from '~/constants/GlobalStyles';

const CustomTextInput = ({ style, ...props }: TextInputProps) => {
  return (
    <TextInput
      style={StyleSheet.flatten([
        styles.root,
        props.editable === false &&
          Platform.OS === 'ios' && {
            backgroundColor: '#F8F8F8',
          },
        style,
      ])}
      placeholderTextColor={Styles.color.neutral[300].color}
      autoCapitalize='none'
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.borderColor.border,
    backgroundColor: 'white',
    padding: 12,
    ...Styles.font.medium,
    ...Styles.fontSize.subhead,
  },
});

export default CustomTextInput;
