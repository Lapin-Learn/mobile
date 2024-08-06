import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

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
    setError,
    formState: { errors },
  } = useForm<SignInFormField>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(schema),
  });

  const signInMutation = useSignIn();

  const renderInput = (
    field: ControllerRenderProps<{ email: string; password: string }>,
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

  const onSubmit: SubmitHandler<SignInFormField> = async (data) => {
    try {
      // TODO: Call your API here (#1)
      await signInMutation.mutateAsync(data);
    } catch {
      setError('email', { message: 'Invalid email or password' });
      setError('password', { message: 'Invalid email or password' });
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
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <View>
              {renderInput(field, 'Password', true)}
              {errors.password && <Text className='text-red-500'>{errors.password.message}</Text>}
            </View>
          )}
        />

        <Link push href='/auth/(forgot-password)'>
          Forgot password?
        </Link>
        <Link push href='/auth/(sign-up)'>
          Sign up
        </Link>

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={signInMutation.isPending}
          title={`${signInMutation.isPending ? 'Loading ...' : 'Sign In'}`}
        />
      </View>
    </SafeAreaView>
  );
}
