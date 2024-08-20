import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type RenderInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T>;
  placeholder: string;
  secureTextEntry?: boolean;
  errorMessage?: string;
};

function RenderInput<T extends FieldValues>({ field, placeholder, secureTextEntry = false }: RenderInputProps<T>) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View className='w-full flex-col justify-start items-start gap-1 inline-flex'>
      <Text className='text-[15px] font-medium font-[Inter] leading-snug text-neutral-900'>
        {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
      </Text>
      <View className='w-full flex flex-row justify-center items-center bg-white'>
        <TextInput
          className='w-full p-3 text-[15px] border-[1px] font-medium font-[Inter] leading-snug placeholder:text-neutral-700'
          placeholder={placeholder}
          value={field.value === 0 ? '' : field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          secureTextEntry={secureTextEntry && isHidden}
        />
        {secureTextEntry && (
          <TouchableOpacity className='absolute right-2' onPress={() => setIsHidden(!isHidden)}>
            <Ionicons name={isHidden ? 'eye-off' : 'eye'} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export { RenderInput };
