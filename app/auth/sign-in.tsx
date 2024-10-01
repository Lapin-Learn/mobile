import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { z } from 'zod';

import LOGOFB from '~/assets/images/facebook.svg';
import LOGOGOOGLE from '~/assets/images/google.svg';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';
import { Button } from '~/components/ui/Button';
import { useSignIn, useSignInWithProvider } from '~/hooks/react-query/useAuth';
import { ProviderNameEnum } from '~/lib/enums';

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
  const { t } = useTranslation('auth');

  const signInMutation = useSignIn();

  const onSubmit: SubmitHandler<SignInFormField> = async (data) => {
    signInMutation.mutate(data);
  };

  return (
    <PlatformView>
      <NavigationBar title={t('signIn.welcomeBack')} />

      <View className='w-full grow flex-col items-center justify-between px-4 pb-8'>
        <Text className='w-full text-callout font-normal text-neutral-500'>{t('signIn.enterDetails')}</Text>
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
            />

            <View className='flex flex-row justify-end'>
              <Link push href='/auth/(forgot-password)'>
                <Text className='text-subhead font-medium text-orange-500'>{t('signIn.forgotPassword')}</Text>
              </Link>
            </View>
          </View>

          <View className='gap-y-6'>
            <Button onPress={handleSubmit(onSubmit)} size={'lg'} disabled={signInMutation.isPending}>
              <Text className='text-body font-semibold text-white'>{t('signIn.signIn')}</Text>
            </Button>
            <View className='flex flex-col items-center justify-center gap-y-[7px]'>
              <Text className='text-subhead font-medium text-supporting-text'>{t('signIn.orSignInWith')}</Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View className='flex flex-row items-center justify-center gap-x-2.5'>
          <Text className='text-footnote text-neutral-900'>{t('signIn.noAccount')}</Text>
          <Link push href='/auth/sign-up'>
            <Text className='text-footnote font-medium text-orange-500'>{t('signIn.signUp')}</Text>
          </Link>
        </View>
      </View>
    </PlatformView>
  );
}

function OtherSignIn() {
  const signInWithProvider = useSignInWithProvider();
  return (
    <View className='flex flex-row items-center justify-center gap-x-[35px]'>
      <LOGOFB onPress={() => {}} width={32} height={32} />
      <LOGOGOOGLE
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
        width={32}
        height={32}
      />
    </View>
  );
}
