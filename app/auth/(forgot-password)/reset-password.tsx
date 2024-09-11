import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
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
  const { t } = useTranslation('auth');
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
    <SafeAreaView className='h-screen'>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title={t('resetPassword.title')} headerLeftShown={true} />
        <View className='w-full grow flex-col items-center justify-between px-4 pb-[21px]'>
          <View className='gap-y-10'>
            <View className='flex-row'>
              <Text className='w-full flex-wrap text-callout font-normal text-neutral-500'>
                {t('resetPassword.instruction')}
              </Text>
            </View>
            <ControllerInput
              props={{ name: 'password', control }}
              label={t('resetPassword.passwordLabel')}
              placeholder={t('resetPassword.passwordPlaceholder')}
              error={errors.password}
            />

            <ControllerInput
              props={{ name: 'confirmPassword', control }}
              label={t('resetPassword.confirmPasswordLabel')}
              placeholder={t('resetPassword.confirmPasswordPlaceholder')}
              error={errors.confirmPassword}
            />
          </View>

          <Button
            className='shadow-button'
            onPress={handleSubmit(onSubmit)}
            disabled={resetPasswordMutation.isPending}
            size={'lg'}>
            <Text className='text-body font-semibold text-white'>{t('resetPassword.resetButton')}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
