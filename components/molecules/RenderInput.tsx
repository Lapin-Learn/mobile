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
    <View className='w-full h-fit flex flex-col justify-end items-star gap-y-1 mb-3'>
      <Text className='font-semibold text-lg'>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Text>
      <View className='w-full flex flex-row justify-center items-center border-2 border-gray-300 rounded-md'>
        <TextInput
          className='w-full h-12 rounded-md border-input border-2 border-blue-500 bg-background px-3 text-base native:leading-[1.25] text-foreground placeholder:text-muted-foreground'
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
