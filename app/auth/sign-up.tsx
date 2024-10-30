import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import LogoGoogle from '~/assets/images/google.svg';
import IconPressable from '~/components/icons/BackIcon';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useSignInWithProvider, useSignUp } from '~/hooks/react-query/useAuth';
import { COLORS, FONTS, GLOBAL_STYLES, TEXTS } from '~/lib/constants';
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
    trigger,
  } = useForm<SignUpFormField>({
    resolver: zodResolver(schema),
  });

  const signUpMutation = useSignUp();

  const onSubmit: SubmitHandler<SignUpFormField> = (data) => {
    signUpMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title={t('signUp.title')} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>{t('signUp.subtitle')}</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
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
              onChangeText={async () => {
                await trigger('confirmPassword');
              }}
            />

            <ControllerInput
              props={{ name: 'confirmPassword', control }}
              label={t('signUp.confirmPasswordLabel')}
              placeholder={t('signUp.confirmPasswordPlaceholder')}
              error={errors.confirmPassword}
              type='password'
            />
          </View>
          <View style={styles.gapY6}>
            <Button onPress={handleSubmit(onSubmit)} disabled={signUpMutation.isPending}>
              <Text style={GLOBAL_STYLES.textButton}>{t('signUp.signUpButton')}</Text>
            </Button>
            <View style={containers.otherSignIn}>
              <Text style={StyleSheet.flatten([FONTS.medium, TEXTS.subhead, { color: COLORS.supportingText }])}>
                {t('signUp.orSignUpWith')}
              </Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View style={containers.doNotHaveAccount}>
          <Text style={StyleSheet.flatten([FONTS.regular, TEXTS.footnote, { color: COLORS.neutral[900] }])}>
            {t('signUp.alreadyHaveAccount')}
          </Text>
          <Link replace href='/auth/sign-in'>
            <Text style={StyleSheet.flatten([FONTS.medium, TEXTS.footnote, { color: COLORS.orange[500] }])}>
              {t('signUp.signIn')}
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  subtitle: {
    width: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 21,
    color: '#5c5c5c',
  },
  formContainer: {
    rowGap: 80,
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  gapY6: {
    rowGap: 24,
  },
  flexColCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const containers = StyleSheet.create({
  otherSignIn: StyleSheet.flatten([styles.flexColCenter, styles.gapY6]),
  doNotHaveAccount: StyleSheet.flatten([styles.flexRowCenter, { gap: 10 }]),
});

export default SignUp;

const OtherSignIn = () => {
  const signInWithProvider = useSignInWithProvider();
  const { t } = useTranslation('auth');
  return (
    <View className='flex flex-row items-center justify-center gap-x-[35px]'>
      {/* TODO: Sign up with facebook */}
      {/* <IconPressable Icon={LogoFacebook} onPress={() => Alert.alert('Coming soon')} /> */}
      <Button
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
        variant='outline'
        className='flex flex-row justify-center gap-2 text-center'>
        <IconPressable Icon={LogoGoogle} />
        <Text className='w-fit'>{t('signIn.continueWith', { name: 'Google' })}</Text>
      </Button>
    </View>
  );
};
