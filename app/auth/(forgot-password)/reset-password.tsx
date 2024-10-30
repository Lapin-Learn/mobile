import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { useResetPassword } from '~/hooks/react-query/useAuth';

const schema = z
  .object({
    password: z.string().min(8, 'change_password.limit_characters'),
    confirmPassword: z.string().min(8, 'change_password.limit_characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'change_password.password_not_match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormField = z.infer<typeof schema>;

const ResetPassword = () => {
  const { t } = useTranslation('auth');
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ResetPasswordFormField>({
    resolver: zodResolver(schema),
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormField) => {
    resetPasswordMutation.mutate({ newPassword: data.password });
  };

  return (
    <PlatformView>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title={t('resetPassword.title')} headerLeftShown={true} />
        <View className='w-full grow flex-col items-center justify-between px-4'>
          <View className='gap-y-10'>
            <View className='flex-row'>
              <Text className='w-full flex-wrap font-inormal text-callout text-neutral-500'>
                {t('resetPassword.instruction')}
              </Text>
            </View>
            <View className='flex gap-y-4'>
              <ControllerInput
                props={{ name: 'password', control }}
                label={t('resetPassword.passwordLabel')}
                placeholder={t('resetPassword.passwordPlaceholder')}
                error={errors.password}
                type='password'
                onChangeText={async () => await trigger('confirmPassword')}
              />

              <ControllerInput
                props={{ name: 'confirmPassword', control }}
                label={t('resetPassword.confirmPasswordLabel')}
                placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                error={errors.confirmPassword}
                type='password'
              />
            </View>
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={resetPasswordMutation.isPending}
            size='lg'
            className='w-full'>
            <Text className='text-button'>{t('resetPassword.resetButton')}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </PlatformView>
  );
};

export default ResetPassword;
