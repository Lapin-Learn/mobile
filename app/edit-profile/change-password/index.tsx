import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { useChangePassword } from '~/hooks/react-query/useUser';

export default function ChangePassword() {
  const { t } = useTranslation('profile');
  const changePasswordMutation = useChangePassword();
  const { isPending } = changePasswordMutation;

  const schema = z
    .object({
      oldPassword: z.string().min(8, t('change_password.limit_characters')),
      newPassword: z.string().min(8, t('change_password.limit_characters')),
      confirmPassword: z.string().min(8, t('change_password.limit_characters')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('change_password.password_not_match'),
      path: ['confirmPassword'],
    });

  type ChangePasswordFormField = z.infer<typeof schema>;

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

  const isButtonDisabled = !oldPassword && !newPassword && !confirmPassword && newPassword !== confirmPassword;

  const onSubmit = (data: ChangePasswordFormField) => {
    changePasswordMutation.mutate({ oldPassword: data.oldPassword, newPassword: data.newPassword });
  };

  return (
    <PlatformView className='m-4 flex gap-y-6'>
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
      <Button disabled={isButtonDisabled} onPress={handleSubmit(onSubmit)}>
        {isPending ? (
          <ActivityIndicator color='white' />
        ) : (
          <Text className='text-button'>{t('change_password.save_button')}</Text>
        )}
      </Button>
    </PlatformView>
  );
}
