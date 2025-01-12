import { zodResolver } from '@hookform/resolvers/zod';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import LogoApple from '~/assets/images/apple.svg';
import LogoGoogle from '~/assets/images/google.svg';
import IconPressable from '~/components/icons/BackIcon';
import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useSignIn, useSignInWithProvider } from '~/hooks/react-query/useAuth';
import { GLOBAL_STYLES } from '~/lib/constants';
import { ProviderNameEnum } from '~/lib/enums';

const { font, fontSize, color } = Styles;

const schema = z.object({
  email: z.string().email('error.email'),
  password: z.string().min(8, 'change_password.limit_characters'),
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

      <View style={styles.content}>
        <Text style={styles.subtitle}>{t('signIn.enterDetails')}</Text>
        <View style={styles.formContainer}>
          <View style={styles.gapY6}>
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

            <View style={styles.forgotPassword}>
              <Link push href='/auth/(forgot-password)'>
                <Text style={StyleSheet.flatten([font.medium, fontSize.subhead, color.orange[500]])}>
                  {t('signIn.forgotPassword')}
                </Text>
              </Link>
            </View>
          </View>

          <View style={styles.gapY6}>
            <Button size='lg' onPress={handleSubmit(onSubmit)} disabled={signInMutation.isPending}>
              <Text style={GLOBAL_STYLES.textButton}>{t('signIn.signIn')}</Text>
            </Button>
            <View style={containers.otherSignIn}>
              <Text style={StyleSheet.flatten([font.medium, fontSize.subhead, color.supportingText])}>
                {t('signIn.orSignInWith')}
              </Text>
              <OtherSignIn />
            </View>
          </View>

          <View style={containers.doNotHaveAccount}>
            <Text style={StyleSheet.flatten([font.normal, fontSize.footnote, color.neutral[900]])}>
              {t('signIn.noAccount')}
            </Text>
            <Link push href='/auth/sign-up'>
              <Text style={StyleSheet.flatten([font.medium, fontSize.footnote, color.orange[500]])}>
                {t('signIn.signUp')}
              </Text>
            </Link>
          </View>
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
      {Platform.OS === 'ios' && (
        <Button
          onPress={() => {
            signInWithProvider.mutate(ProviderNameEnum.APPLE);
          }}
          variant='outline'
          size='lg'
          style={[otherSignInStyles.googleButton, { position: 'relative' }]}>
          <IconPressable Icon={LogoApple} />
          <Text>{t('signIn.continueWith', { name: 'Apple' })}</Text>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            onPress={() => {}}
          />
        </Button>
      )}
      <Button
        onPress={() => {
          signInWithProvider.mutate(ProviderNameEnum.GOOGLE);
        }}
        variant='outline'
        size='lg'
        style={otherSignInStyles.googleButton}>
        <IconPressable Icon={LogoGoogle} />
        <Text>{t('signIn.continueWith', { name: 'Google' })}</Text>
      </Button>
    </View>
  );
};

export default SignIn;
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
