import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { RenderInput } from '~/components/molecules/RenderInput';
import { useSignUp } from '~/hooks/react-query/useAuth';

const schema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
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
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormField>({
    resolver: zodResolver(schema),
  });

  const signUpMutation = useSignUp();

  const onSubmit: SubmitHandler<SignUpFormField> = (data) => {
    signUpMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <SafeAreaView>
      <View className='gap-y-2'>
        <Controller
          name='username'
          control={control}
          render={({ field }) => (
            <View>
              <RenderInput field={field} placeholder='Username' />
              {errors.username && <Text className='text-red-500'>{errors.username.message}</Text>}
            </View>
          )}
        />
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
              <RenderInput field={field} placeholder='Password' secureTextEntry={true} />
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
          title={`${isSubmitting ? 'Loading ...' : 'Sign Up'}`}
        />
      </View>
    </SafeAreaView>
  );
}
