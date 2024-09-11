import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import LOGOFB from '~/assets/images/facebook.svg';
import LOGOGOOGLE from '~/assets/images/google.svg';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
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
  const { t } = useTranslation('auth');

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
    <SafeAreaView className='h-screen'>
      <NavigationBar title={t('signUp.title')} />
      <View className='w-full grow flex-col items-center justify-between px-4 pb-8'>
        <Text className='w-full text-callout font-normal text-neutral-500'>{t('signUp.subtitle')}</Text>
        <View className='gap-y-20'>
          <View className='flex gap-y-4'>
            <ControllerInput
              props={{ name: 'email', control }}
              label={t('signUp.emailLabel')}
              placeholder={t('signUp.emailPlaceholder')}
              error={errors.email}
            />

            <ControllerInput
              props={{ name: 'password', control }}
              label={t('signUp.passwordLabel')}
              placeholder={t('signUp.passwordPlaceholder')}
              error={errors.password}
            />

            <ControllerInput
              props={{ name: 'confirmPassword', control }}
              label={t('signUp.confirmPasswordLabel')}
              placeholder={t('signUp.confirmPasswordPlaceholder')}
              error={errors.confirmPassword}
            />
          </View>
          <View className='gap-y-6'>
            <Button className='shadow-button' onPress={handleSubmit(onSubmit)} disabled={signUpMutation.isPending}>
              <Text className='text-body font-semibold text-white'>{t('signUp.signUpButton')}</Text>
            </Button>
            <View className='flex flex-col items-center justify-center gap-y-[7px]'>
              <Text className='text-subhead font-medium text-supporting-text'>{t('signUp.orSignUpWith')}</Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View className='flex flex-row items-center justify-center gap-x-2.5'>
          <Text className='text-footnote text-neutral-900'>{t('signUp.alreadyHaveAccount')}</Text>
          <Link push href='/auth/sign-in'>
            <Text className='text-footnote font-medium text-orange-500'>{t('signUp.signIn')}</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

function OtherSignIn() {
  return (
    <View className='flex flex-row items-center justify-center gap-x-[35px]'>
      <LOGOFB onPress={() => {}} width={32} height={32} />
      <LOGOGOOGLE onPress={() => {}} width={32} height={32} />
    </View>
  );
}
