import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { useForgotPassword } from '~/hooks/react-query/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type ForgotPasswordFormField = z.infer<typeof schema>;

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormField>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const renderInput = (
    field: ControllerRenderProps<{ email: string }>,
    placeholder: string,
    secureTextEntry = false
  ) => {
    return (
      <View className='gap-y-1'>
        <Text>{placeholder}</Text>
        <TextInput
          className='w-full h-12 border border-gray-black p-2'
          secureTextEntry={secureTextEntry}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
        />
      </View>
    );
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormField> = async (data) => {
    try {
      // TODO: Call your API here (#1)
      await forgotPasswordMutation.mutateAsync(data);
    } catch {
      setError('email', { message: 'Invalid email or password' });
    }
  };

  return (
    <SafeAreaView>
      <View className='gap-y-2'>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <View>
              {renderInput(field, 'Email')}
              {errors.email && <Text className='text-red-500'>{errors.email.message}</Text>}
            </View>
          )}
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          title={`${isSubmitting ? 'Loading ...' : 'Verify'}`}
        />
      </View>
    </SafeAreaView>
  );
}
