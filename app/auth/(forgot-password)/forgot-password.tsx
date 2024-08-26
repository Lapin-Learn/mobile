import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/button';
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
    formState: { errors },
  } = useForm<ForgotPasswordFormField>({
    resolver: zodResolver(schema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit: SubmitHandler<ForgotPasswordFormField> = (data) => {
    try {
      forgotPasswordMutation.mutate(data);
    } catch {
      setError('email', { message: 'Invalid email or password' });
    }
  };

  return (
    <View className='h-screen'>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title='Forgot Password' headerLeftShown={true} />
        <View className='bg-background grow w-full px-4 pb-[21px] flex-col justify-between items-center inline-flex'>
          <View className='gap-y-10 '>
            <View className='flex-row'>
              <Text className='w-full flex-wrap text-neutral-500 font-normal text-callout'>
                Please enter your email account to send the code verification to reset your password
              </Text>
            </View>
            <ControllerInput
              props={{ name: 'email', control }}
              label='Email'
              placeholder='example@gmail.com'
              error={errors.email}
            />
          </View>

          <Button
            className='w-full bg-orange-500 shadow-button shadow-orange-700 py-3.5 px-5 rounded-none'
            onPress={handleSubmit(onSubmit)}
            disabled={forgotPasswordMutation.isPending}
            size={'lg'}>
            <Text className='text-white text-body font-semibold'>Send OTP</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
