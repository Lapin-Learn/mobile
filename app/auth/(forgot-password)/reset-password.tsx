import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useResetPassword } from '~/hooks/react-query/useAuth';
import { GLOBAL_STYLES } from '~/lib/constants';

const schema = z
  .object({
    password: z.string().min(8, 'change_password.limit_characters'),
    confirmPassword: z.string().min(8, 'change_password.limit_characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'change_password.password_not_match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormField = z.infer<typeof schema>;

const ResetPassword = () => {
  const { t } = useTranslation('auth');
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ResetPasswordFormField>({
    resolver: zodResolver(schema),
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormField) => {
    resetPasswordMutation.mutate({ newPassword: data.password });
  };

  return (
    <PlatformView>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title={t('resetPassword.title')} headerLeftShown={true} />
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
                {t('resetPassword.instruction')}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <ControllerInput
                props={{ name: 'password', control }}
                label={t('resetPassword.passwordLabel')}
                placeholder={t('resetPassword.passwordPlaceholder')}
                error={errors.password}
                type='password'
                onChangeText={async () => await trigger('confirmPassword')}
              />

              <ControllerInput
                props={{ name: 'confirmPassword', control }}
                label={t('resetPassword.confirmPasswordLabel')}
                placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                error={errors.confirmPassword}
                type='password'
              />
            </View>
          </View>

          <Button size='lg' onPress={handleSubmit(onSubmit)} disabled={resetPasswordMutation.isPending}>
            <Text style={GLOBAL_STYLES.textButton}>{t('resetPassword.resetButton')}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </PlatformView>
  );
};

export default ResetPassword;

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
  inputContainer: {
    flexDirection: 'column',
    gap: 16,
  },
});
