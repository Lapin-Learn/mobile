import { zodResolver } from '@hookform/resolvers/zod';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
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
      <View style={styles.content} onTouchStart={Keyboard.dismiss}>
        <Text style={styles.subtitle}>{t('signUp.subtitle')}</Text>
        <View style={styles.formContainer}>
          <View style={styles.gapY6}>
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
            <Text style={StyleSheet.flatten([font.normal, fontSize.subhead, color.orange[500]])}>
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
      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{
            width: '100%',
            height: 50,
            margin: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 8,
            ...Styles.fontSize.subhead,
          }}
          onPress={() => {
            signInWithProvider.mutate(ProviderNameEnum.APPLE);
          }}
        />
      )}
      <Button
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
        variant='outline'
        style={otherSignInStyles.googleButton}>
        <IconPressable Icon={LogoGoogle} />
        <Text style={[font.medium, fontSize.callout, color.black]}>{t('signIn.continueWith', { name: 'Google' })}</Text>
      </Button>
    </View>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  subtitle: {
    width: '100%',
    ...font.normal,
    ...fontSize.callout,
    ...color.neutral[500],
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  gapY6: {
    gap: 16,
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowCenter: {
    flexDirection: 'row',
  },
  forgotPassword: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

const containers = StyleSheet.create({
  otherSignIn: {
    ...styles.flexCenter,
    ...styles.gapY6,
  },
  doNotHaveAccount: {
    ...styles.flexCenter,
    ...styles.flexRowCenter,
    gap: 10,
  },
});

const otherSignInStyles = StyleSheet.create({
  container: {
    ...styles.flexCenter,
    width: '100%',
    gap: 12,
  },
  googleButton: {
    ...styles.flexCenter,
    ...styles.flexRowCenter,
    gap: 8,
  },
});
