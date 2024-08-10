import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { useSignIn } from '~/hooks/react-query/useAuth';
import { signIn } from '~/hooks/zustand';
import { RenderInput } from '~/components/molecules/RenderInput';

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

  const onSubmit: SubmitHandler<SignInFormField> = async (data) => {
    try {
      // TODO: Call your API here (#1)
      const result = await signInMutation.mutateAsync(data);
      signIn(result);
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
              <RenderInput field={field} placeholder='Email' />
              {errors.email && <Text className='text-red-500'>{errors.email.message}</Text>}
            </View>
          )}
        />
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <View>
              <RenderInput field={field} placeholder='Password' secureTextEntry />
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
