import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useForgotPassword } from '~/hooks/react-query/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type ForgotPasswordFormField = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { t } = useTranslation('auth');

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
      setError('email', { message: t('forgotPassword.invalidEmailOrPassword') });
    }
  };

  return (
    <SafeAreaView className='h-screen'>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title={t('forgotPassword.title')} headerLeftShown={true} />
        <View className='w-full grow flex-col items-center justify-between px-4 pb-[21px]'>
          <View className='gap-y-10'>
            <View className='flex-row'>
              <Text className='w-full flex-wrap text-callout font-normal text-neutral-500'>
                {t('forgotPassword.instruction')}
              </Text>
            </View>
            <ControllerInput
              props={{ name: 'email', control }}
              label={t('forgotPassword.emailLabel')}
              placeholder={t('forgotPassword.emailPlaceholder')}
              error={errors.email}
            />
          </View>

          <Button
            className='w-full shadow-button'
            onPress={handleSubmit(onSubmit)}
            disabled={forgotPasswordMutation.isPending}
            size={'lg'}>
            <Text className='text-body font-semibold text-white'>{t('forgotPassword.sendOtpButton')}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
