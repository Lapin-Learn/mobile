import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Option } from '~/components/primitives/select';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';
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
          {options.map((item, index) => (
            <View key={item.value}>
              <SelectItem value={item.value} label={item.label} />
              {index < options.length - 1 && <SelectSeparator style={{ marginVertical: 4 }} />}
            </View>
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
    ...Styles.borderColor.neutral[200],
    backgroundColor: 'white',
    padding: 12,
  },
  value: {
    ...Styles.fontSize.subhead,
    ...Styles.font.medium,
  },
  content: { width: '100%', backgroundColor: 'white', borderRadius: 8, paddingVertical: 4 },
});

export default SelectInput;
