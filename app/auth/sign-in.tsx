import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { RenderInput } from '~/components/molecules/RenderInput';
import { Button } from '~/components/ui/button';
import { useSignIn } from '~/hooks/react-query/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormField = z.infer<typeof schema>;

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormField>({
    resolver: zodResolver(schema),
  });

  const signInMutation = useSignIn();

  const onSubmit: SubmitHandler<SignInFormField> = async (data) => {
    // TODO: Call your API here (#1)
    signInMutation.mutate(data);
    // signIn(result);
  };

  return (
    <SafeAreaView className='h-screen text-[#f8f7f6]'>
      <View className='bg-[#f8f7f6]'>
        <View className='self-stretch h-[54px] pl-4' />
        <View className='w-full self-stretch pl-4 gap-2.5 inline-flex'>
          <Text className='text-orange-900 text-[34px] font-bold font-[Inter] leading-[51px]'>Welcome back</Text>
        </View>
      </View>
      <View className='bg-[#f8f7f6] grow w-full px-4 pb-8 flex-col justify-between items-center inline-flex'>
        <Text className='w-full text-neutral-500 font-normal font-[Inter] leading-normal text-[16px] text-left'>
          Please enter your detail to access your account
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
            <View className='flex flex-row justify-end'>
              <Link push href='/auth/(forgot-password)'>
                <Text className='text-orange-500 text-[15px] font-medium font-[Inter] leading-normal'>
                  Forgot password?
                </Text>
              </Link>
            </View>
          </View>
          <View className='gap-y-6'>
            <Button
              className='w-full bg-orange-500 text-white rounded-none shadow-sm shadow-orange-500 py-[14px] px-[20px]'
              onPress={handleSubmit(onSubmit)}
              size={'lg'}
              disabled={signInMutation.isPending}>
              <Text className='text-white text-[17px] font-semibold font-[Inter] leading-relaxed'>Sign In</Text>
            </Button>
            <View className='flex flex-col justify-center items-center gap-y-[7px]'>
              <Text className='text-[#929292] text-[15px] font-medium font-[Inter] leading-snug'>Or sign in with</Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View className='flex flex-row justify-center items-center gap-x-[10px]'>
          <Text className='text-neutral-900 text-[13px] font-normal font-[Inter] leading-tight'>
            Don&apos;t have an account?
          </Text>
          <Link push href='/auth/sign-up'>
            <Text className='text-orange-500 text-[13px] font-normal font-[Inter] leading-tight'>Sign Up</Text>
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
