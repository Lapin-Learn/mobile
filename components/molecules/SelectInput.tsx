import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';

import { Option } from '../primitives/select';

type SelectProps = {
  defaultValue: { value: string; label: string };
  onValueChange?: (option: Option) => void;
  options: { value: string; label: string }[];
  placeholder: string;
};

export default function SelectInput({ defaultValue, onValueChange, options, placeholder }: SelectProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className='h-12 w-full rounded border border-neutral-200 bg-white p-3 placeholder:text-neutral-700'>
        <SelectValue className='text-subhead font-medium' placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className='w-full'>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem className='text-subhead font-medium' key={item.value} value={item.value} label={item.label} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
