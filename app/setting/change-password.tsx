import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';
import { Button } from '~/components/ui/Button';

const schema = z.object({
  oldPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

type ChangePasswordFormField = z.infer<typeof schema>;

export default function ChangePassword() {
  const { t } = useTranslation('profile');
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordFormField>({
    resolver: zodResolver(schema),
  });

  const oldPassword = watch('oldPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const isButtonDisabled = !oldPassword && !newPassword && !confirmPassword;

  return (
    <PlatformView className='m-4 flex gap-6'>
      <NavigationBar headerTitle={t('change_password.title')} headerLeftShown icon={X} />
      <View className='flex gap-4'>
        <ControllerInput
          props={{ name: 'oldPassword', control }}
          label={t('change_password.old_password')}
          placeholder={t('change_password.old_password_placeholder')}
          error={errors.oldPassword}
          textContentType='password'
          secureTextEntry
        />
        <ControllerInput
          props={{ name: 'newPassword', control }}
          label={t('change_password.new_password')}
          placeholder={t('change_password.new_password_placeholder')}
          error={errors.newPassword}
          textContentType='newPassword'
          secureTextEntry
        />
        <ControllerInput
          props={{ name: 'confirmPassword', control }}
          label={t('change_password.confirm_password')}
          placeholder={t('change_password.confirm_password_placeholder')}
          error={errors.confirmPassword}
          textContentType='newPassword'
          secureTextEntry
        />
      </View>
      <Button disabled={isButtonDisabled}>
        <Text className='text-button'>{t('change_password.save_button')}</Text>
      </Button>
    </PlatformView>
  );
}
