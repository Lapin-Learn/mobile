import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';

import { cn } from '~/lib/utils';

const PasswordInput = ({ className, ...props }: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className='relative w-full items-center justify-center'>
      <TextInput
        className={cn(
          'w-full rounded border border-neutral-200 bg-white p-3 text-subhead font-medium placeholder:text-neutral-300',
          className
        )}
        {...props}
        secureTextEntry={!showPassword}
      />
      <Pressable onPress={() => setShowPassword(!showPassword)} className='absolute right-3 justify-center'>
        {!showPassword ? <EyeIcon size={24} color='#b4b4b4' /> : <EyeOffIcon size={24} color='#b4b4b4' />}
      </Pressable>
    </View>
  );
};

export default PasswordInput;
