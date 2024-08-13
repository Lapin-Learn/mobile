import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { RenderInput } from '~/components/molecules/RenderInput';
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
        <Link push href='/auth/sign-up'>
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
