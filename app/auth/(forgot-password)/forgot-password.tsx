import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useForgotPassword } from '~/hooks/react-query/useAuth';
import { GLOBAL_STYLES } from '~/lib/constants';

const schema = z.object({
  email: z.string().email('error.email'),
});

type ForgotPasswordFormField = z.infer<typeof schema>;

const ForgotPassword = () => {
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
    <PlatformView>
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <NavigationBar title={t('forgotPassword.title')} headerLeftShown />
        <View style={styles.container}>
          <View style={styles.instructionContainer}>
            <View style={styles.instructionTextContainer}>
              <Text
                style={StyleSheet.flatten([
                  styles.instructionText,
                  Styles.font.normal,
                  Styles.fontSize.callout,
                  Styles.color.neutral[500],
                ])}>
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

          <Button size='lg' onPress={handleSubmit(onSubmit)} disabled={forgotPasswordMutation.isPending}>
            <Text style={GLOBAL_STYLES.textButton}>{t('forgotPassword.sendOtpButton')}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </PlatformView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  instructionContainer: {
    gap: 40,
  },
  instructionTextContainer: {
    flexDirection: 'row',
  },
  instructionText: {
    width: '100%',
    flexWrap: 'wrap',
  },
});
