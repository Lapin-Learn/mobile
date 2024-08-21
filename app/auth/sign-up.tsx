import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { RenderInput } from '~/components/molecules/RenderInput';
import { Button } from '~/components/ui/button';
import { useSignUp } from '~/hooks/react-query/useAuth';

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormField = z.infer<typeof schema>;

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormField>({
    resolver: zodResolver(schema),
  });

  const signUpMutation = useSignUp();

  const onSubmit: SubmitHandler<SignUpFormField> = (data) => {
    signUpMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <SafeAreaView className='h-screen text-[#f8f7f6]'>
      <View className='bg-[#f8f7f6]'>
        <View className='self-stretch h-[54px] pl-4' />
        <View className='w-full self-stretch pl-4 gap-2.5 inline-flex'>
          <Text className='text-orange-900 text-[34px] font-bold font-[Inter] leading-[51px]'>Getting started</Text>
        </View>
      </View>
      <View className='bg-[#f8f7f6] grow w-full px-4 pb-8 flex-col justify-between items-center inline-flex'>
        <Text className='w-full text-neutral-500 font-normal font-[Inter] leading-normal text-[16px] text-left'>
          Let&apos;s create your account here
        </Text>
        <View className='gap-y-20'>
          <View className='flex gap-y-4'>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <View>
                  <RenderInput field={field} placeholder='example@gmail.com' />
                  {errors.email && <Text className='text-red-500'>{errors.email.message}</Text>}
                </View>
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <View>
                  <RenderInput field={field} placeholder='at least 8 character' secureTextEntry />
                  {errors.password && <Text className='text-red-500'>{errors.password.message}</Text>}
                </View>
              )}
            />
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <View>
                  <RenderInput field={field} placeholder='Confirm your password' secureTextEntry />
                  {errors.confirmPassword && <Text className='text-red-500'>{errors.confirmPassword.message}</Text>}
                </View>
              )}
            />
          </View>
          <View className='gap-y-6'>
            <Button
              className='w-full bg-orange-500 text-white rounded-none shadow-sm shadow-orange-500 py-[14px] px-[20px]'
              onPress={handleSubmit(onSubmit)}
              size={'lg'}
              disabled={signUpMutation.isPending}>
              <Text className='text-white text-base font-semibold font-[Inter] leading-relaxed'>Sign Up</Text>
            </Button>
            <View className='flex flex-col justify-center items-center gap-y-[7px]'>
              <Text className='text-[#929292] text-[15px] font-medium font-[Inter] leading-snug'>Or sign up with</Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View className='flex flex-row justify-center items-center gap-x-[10px]'>
          <Text className='text-neutral-900 text-[13px] font-normal font-[Inter] leading-tight'>
            Already have an account?{' '}
          </Text>
          <Link push href='/auth/sign-in'>
            <Text className='text-orange-500 text-[13px] font-normal font-[Inter] leading-tight'>Sign In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

function OtherSignIn() {
  return (
    <View className='flex flex-row justify-center items-center gap-x-[35px]'>
      <Pressable className='bg-transparent' onPress={() => {}}>
        <Image className='w-8 h-8' source={require('~/assets/images/facebook.png')} />
      </Pressable>
      <Pressable className='bg-transparent' onPress={() => {}}>
        <Image className='w-8 h-8' source={require('~/assets/images/google.png')} />
      </Pressable>
    </View>
  );
}
