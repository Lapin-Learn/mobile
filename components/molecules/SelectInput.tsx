import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';

import { Option } from '../primitives/select';

type SelectProps = {
  defaultValue: { value: string; label: string };
  onValueChange?: (option: Option) => void;
  options: { value: string; label: string }[];
  placeholder: string;
};

const SelectInput = ({ defaultValue, onValueChange, options, placeholder }: SelectProps) => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 16,
    right: 16,
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className='h-12 w-full rounded border border-neutral-200 bg-white p-3 placeholder:text-neutral-700'>
        <SelectValue className='font-imedium text-subhead' placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className='w-full'>
        <SelectGroup>
          {options.map((item, index) => (
            <View key={item.value}>
              <SelectItem className='font-imedium text-subhead' value={item.value} label={item.label} />
              {index < options.length - 1 && <SelectSeparator className='my-1' />}
            </View>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
