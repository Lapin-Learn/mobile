import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Text, View } from 'react-native';
import { z } from 'zod';

import LogoFacebook from '~/assets/images/facebook.svg';
import LogoGoogle from '~/assets/images/google.svg';
import IconPressable from '~/components/icons/BackIcon';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { useSignIn, useSignInWithProvider } from '~/hooks/react-query/useAuth';
import { ProviderNameEnum } from '~/lib/enums';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormField = z.infer<typeof schema>;

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormField>({
    resolver: zodResolver(schema),
  });
  const { t } = useTranslation('auth');

  const signInMutation = useSignIn();

  const onSubmit = (data: SignInFormField) => {
    signInMutation.mutate(data);
  };

  return (
    <PlatformView>
      <NavigationBar title={t('signIn.welcomeBack')} />

      <View className='w-full grow flex-col items-center justify-between px-4 pb-8'>
        <Text className='w-full font-inormal text-callout text-neutral-500'>{t('signIn.enterDetails')}</Text>
        <View className='gap-y-20'>
          <View className='flex gap-y-4'>
            <ControllerInput
              props={{ name: 'email', control }}
              label={t('signIn.email')}
              placeholder={t('signIn.emailPlaceholder')}
              error={errors.email}
            />

            <ControllerInput
              props={{ name: 'password', control }}
              label={t('signIn.password')}
              placeholder={t('signIn.passwordPlaceholder')}
              error={errors.password}
              type='password'
            />

            <View className='flex flex-row justify-end'>
              <Link push href='/auth/(forgot-password)'>
                <Text className='font-imedium text-subhead text-orange-500'>{t('signIn.forgotPassword')}</Text>
              </Link>
            </View>
          </View>

          <View className='gap-y-6'>
            <Button onPress={handleSubmit(onSubmit)} size='lg' disabled={signInMutation.isPending}>
              <Text className='text-button'>{t('signIn.signIn')}</Text>
            </Button>
            <View className='flex flex-col items-center justify-center gap-y-[7px]'>
              <Text className='font-imedium text-subhead text-supporting-text'>{t('signIn.orSignInWith')}</Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View className='flex flex-row items-center justify-center gap-x-2.5'>
          <Text className='text-footnote text-neutral-900'>{t('signIn.noAccount')}</Text>
          <Link push href='/auth/sign-up'>
            <Text className='font-imedium text-footnote text-orange-500'>{t('signIn.signUp')}</Text>
          </Link>
        </View>
      </View>
    </PlatformView>
  );
};

export default SignIn;

const OtherSignIn = () => {
  const signInWithProvider = useSignInWithProvider();
  return (
    <View className='flex flex-row items-center justify-center gap-x-[35px]'>
      <IconPressable Icon={LogoFacebook} onPress={() => Alert.alert('Coming soon')} />
      <IconPressable
        Icon={LogoGoogle}
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
      />
    </View>
  );
};
