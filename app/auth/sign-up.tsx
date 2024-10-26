import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import LogoGoogle from '~/assets/images/google.svg';
import IconPressable from '~/components/icons/BackIcon';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useSignInWithProvider, useSignUp } from '~/hooks/react-query/useAuth';
import { ProviderNameEnum } from '~/lib/enums';

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

const SignUp = () => {
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
        <Text className='w-full font-inormal text-callout text-neutral-500'>{t('signUp.subtitle')}</Text>
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
              type='password'
            />

            <ControllerInput
              props={{ name: 'confirmPassword', control }}
              label={t('signUp.confirmPasswordLabel')}
              placeholder={t('signUp.confirmPasswordPlaceholder')}
              error={errors.confirmPassword}
              type='password'
            />
          </View>
          <View className='gap-y-6'>
            <Button onPress={handleSubmit(onSubmit)} disabled={signUpMutation.isPending}>
              <Text className='text-button'>{t('signUp.signUpButton')}</Text>
            </Button>
            <View className='flex flex-col items-center justify-center gap-y-[7px]'>
              <Text className='font-imedium text-subhead text-supporting-text'>{t('signUp.orSignUpWith')}</Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View className='flex flex-row items-center justify-center gap-x-2.5'>
          <Text className='text-footnote text-neutral-900'>{t('signUp.alreadyHaveAccount')}</Text>
          <Link replace href='/auth/sign-in'>
            <Text className='font-imedium text-footnote text-orange-500'>{t('signUp.signIn')}</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const OtherSignIn = () => {
  const signInWithProvider = useSignInWithProvider();
  return (
    <View className='flex flex-row items-center justify-center gap-x-[35px]'>
      {/* TODO: Sign up with facebook */}
      {/* <IconPressable Icon={LogoFacebook} onPress={() => Alert.alert('Coming soon')} /> */}
      <IconPressable
        Icon={LogoGoogle}
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
      />
    </View>
  );
};
