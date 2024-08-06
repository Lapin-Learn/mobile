import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Controller, ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { useResetPassword } from '~/hooks/react-query/useAuth';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type ResetPasswordFormField = z.infer<typeof schema>;

export default function ResetPassword() {
  const { email } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormField>({
    defaultValues: { password: '', confirmPassword: '' },
    resolver: zodResolver(schema),
  });

  const resetPasswordMutation = useResetPassword();

  const renderInput = (
    field: ControllerRenderProps<{ password: string; confirmPassword: string }>,
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

  const onSubmit: SubmitHandler<ResetPasswordFormField> = async (data) => {
    try {
      // TODO: Call your API here (#1)
      await resetPasswordMutation.mutateAsync({ email: email as string, password: data.password });
    } catch {}
  };

  return (
    <SafeAreaView>
      <View className='gap-y-2'>
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <View>
              {renderInput(field, 'New Password', true)}
              {errors.password && <Text className='text-red-500'>{errors.password.message}</Text>}
            </View>
          )}
        />
        <Controller
          name='confirmPassword'
          control={control}
          render={({ field }) => (
            <View>
              {renderInput(field, 'Confirm New Password', true)}
              {errors.confirmPassword && <Text className='text-red-500'>{errors.confirmPassword.message}</Text>}
            </View>
          )}
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          title={`${isSubmitting ? 'Loading ...' : 'Reset Password'}`}
        />
      </View>
    </SafeAreaView>
  );
}
