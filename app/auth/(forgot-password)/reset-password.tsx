import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/button';
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
    formState: { errors },
  } = useForm<ResetPasswordFormField>({
    resolver: zodResolver(schema),
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordFormField> = (data) => {
    resetPasswordMutation.mutate({ newPassword: data.password });
  };

  return (
    <View className='h-screen'>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title='Reset Password' headerLeftShown={true} />
        <View className='bg-background grow w-full px-4 pb-[21px] flex-col justify-between items-center inline-flex'>
          <View className='gap-y-10 '>
            <View className='flex-row'>
              <Text className='w-full flex-wrap text-neutral-500 font-normal text-callout'>... </Text>
            </View>
            <ControllerInput
              props={{ name: 'password', control }}
              label='Password'
              placeholder='at least 8 character'
              error={errors.password}
            />

            <ControllerInput
              props={{ name: 'confirmPassword', control }}
              label='Confirm Password'
              placeholder='Confirm your new password'
              error={errors.confirmPassword}
            />
          </View>

          <Button
            className='w-full bg-orange-500 shadow-button shadow-orange-700 py-3.5 px-5 rounded-none'
            onPress={handleSubmit(onSubmit)}
            disabled={resetPasswordMutation.isPending}
            size={'lg'}>
            <Text className='text-white text-body font-semibold'>Reset Password</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
