import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { RenderInput } from '~/components/molecules/RenderInput';
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
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormField>({
    resolver: zodResolver(schema),
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordFormField> = (data) => {
    // TODO: Call your API here (#1)
    resetPasswordMutation.mutate({ newPassword: data.password });
  };

  return (
    <SafeAreaView>
      <View className='gap-y-2'>
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <View>
              <RenderInput field={field} placeholder='New Password' secureTextEntry={true} />
              {errors.password && <Text className='text-red-500'>{errors.password.message}</Text>}
            </View>
          )}
        />
        <Controller
          name='confirmPassword'
          control={control}
          render={({ field }) => (
            <View>
              <RenderInput field={field} placeholder='Confirm Password' secureTextEntry={true} />
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
