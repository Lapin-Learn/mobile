import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { RenderInput } from '~/components/molecules/RenderInput';
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
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormField>({
    resolver: zodResolver(schema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit: SubmitHandler<ForgotPasswordFormField> = (data) => {
    try {
      // TODO: Call your API here (#1)
      forgotPasswordMutation.mutate(data);
    } catch {
      setError('email', { message: 'Invalid email or password' });
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

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          title={`${isSubmitting ? 'Loading ...' : 'Verify'}`}
        />
      </View>
    </SafeAreaView>
  );
}
