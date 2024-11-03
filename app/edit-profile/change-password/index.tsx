import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useChangePassword } from '~/hooks/react-query/useUser';
import { GLOBAL_STYLES } from '~/lib/constants';

const schema = z
  .object({
    oldPassword: z.string().min(8, 'change_password.limit_characters'),
    newPassword: z.string().min(8, 'change_password.limit_characters'),
    confirmPassword: z.string().min(8, 'change_password.limit_characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'change_password.password_not_match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormField = z.infer<typeof schema>;

const ChangePassword = () => {
  const { t } = useTranslation('profile');
  const changePasswordMutation = useChangePassword();
  const { isPending } = changePasswordMutation;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<ChangePasswordFormField>({
    resolver: zodResolver(schema),
  });

  const oldPassword = watch('oldPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const isButtonDisabled = !oldPassword && !newPassword && !confirmPassword && newPassword !== confirmPassword;

  const onSubmit = (data: ChangePasswordFormField) => {
    changePasswordMutation.mutate({ oldPassword: data.oldPassword, newPassword: data.newPassword });
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, Platform.OS === 'android' && styles.androidPadding]}>
      <NavigationBar headerTitle={t('change_password.title')} headerLeftShown icon={X} />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ControllerInput
            props={{ name: 'oldPassword', control }}
            label={t('change_password.old_password')}
            placeholder={t('change_password.old_password_placeholder')}
            error={errors.oldPassword}
            type='password'
          />
          <ControllerInput
            props={{ name: 'newPassword', control }}
            label={t('change_password.new_password')}
            placeholder={t('change_password.new_password_placeholder')}
            error={errors.newPassword}
            type='password'
            onChangeText={async () => await trigger('confirmPassword')}
          />
          <ControllerInput
            props={{ name: 'confirmPassword', control }}
            label={t('change_password.confirm_password')}
            placeholder={t('change_password.confirm_password_placeholder')}
            error={errors.confirmPassword}
            type='password'
          />
        </View>
        <Button disabled={isButtonDisabled} onPress={handleSubmit(onSubmit)} size='lg'>
          {isPending ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text style={GLOBAL_STYLES.textButton}>{t('change_password.save_button')}</Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  safeAreaView: {
    height: '100%',
  },
  androidPadding: {
    paddingTop: 44,
  },
  container: {
    margin: 16,
    flex: 1,
    gap: 24,
  },
  inputContainer: {
    flex: 1,
    gap: 16,
  },
});
