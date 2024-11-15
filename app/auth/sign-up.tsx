import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import LogoGoogle from '~/assets/images/google.svg';
import IconPressable from '~/components/icons/BackIcon';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useSignInWithProvider, useSignUp } from '~/hooks/react-query/useAuth';
import { GLOBAL_STYLES } from '~/lib/constants';
import { ProviderNameEnum } from '~/lib/enums';

const { font, fontSize, color } = Styles;

const schema = z
  .object({
    email: z.string().email('error.email'),
    password: z.string().min(8, 'change_password.limit_characters'),
    confirmPassword: z.string().min(8, 'change_password.limit_characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'change_password.password_not_match',
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
    <PlatformView>
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
            <Button size='lg' onPress={handleSubmit(onSubmit)} disabled={signUpMutation.isPending}>
              <Text style={GLOBAL_STYLES.textButton}>{t('signUp.signUpButton')}</Text>
            </Button>
            <View style={containers.otherSignIn}>
              <Text style={StyleSheet.flatten([font.medium, fontSize.subhead, color.supportingText])}>
                {t('signUp.orSignUpWith')}
              </Text>
              <OtherSignIn />
            </View>
          </View>
        </View>
        <View style={containers.doNotHaveAccount}>
          <Text style={StyleSheet.flatten([font.normal, fontSize.footnote, color.neutral[900]])}>
            {t('signUp.alreadyHaveAccount')}
          </Text>
          <Link replace href='/auth/sign-in'>
            <Text style={StyleSheet.flatten([font.medium, fontSize.footnote, color.orange[500]])}>
              {t('signUp.signIn')}
            </Text>
          </Link>
        </View>
      </View>
    </PlatformView>
  );
};

const OtherSignIn = () => {
  const signInWithProvider = useSignInWithProvider();
  const { t } = useTranslation('auth');

  return (
    <View style={otherSignInStyles.container}>
      {/* TODO: Sign up with Facebook */}
      {/* <IconPressable Icon={LogoFacebook} onPress={() => Alert.alert('Coming soon')} /> */}
      <Button
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
        variant='outline'
        style={otherSignInStyles.googleButton}>
        <IconPressable Icon={LogoGoogle} />
        <Text>{t('signIn.continueWith', { name: 'Google' })}</Text>
      </Button>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
    gap: 80,
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  gapY6: {
    gap: 24,
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

const otherSignInStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 35,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
