import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Option } from '~/components/primitives/select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import Styles from '~/constants/GlobalStyles';

type SelectProps = {
  defaultValue: { value: string; label: string };
  onValueChange?: (option: Option) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  style?: StyleProp<TextStyle>;
};

const SelectInput = ({ defaultValue, onValueChange, options, placeholder, style }: SelectProps) => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 16,
    right: 16,
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger style={StyleSheet.flatten([styles.trigger, style])}>
        <SelectValue style={styles.value} placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent insets={contentInsets} style={styles.content}>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem value={item.value} key={item.value} label={item.label} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.borderColor.border,
    backgroundColor: 'white',
    padding: 12,
  },
  value: {
    ...Styles.fontSize.subhead,
    ...Styles.font.medium,
  },
  content: { width: '100%' },
});

export default SelectInput;
