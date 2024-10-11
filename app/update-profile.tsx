import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useUpdateUserProfile } from '~/hooks/react-query/useUser';
import { GenderEnum } from '~/lib/enums';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().optional(),
  dob: z
    .date()
    .min(new Date('1900-01-01'), { message: 'Invalid date' })
    .max(new Date(), { message: 'Invalid date' })
    .optional(),
  gender: z.nativeEnum(GenderEnum).optional(),
});

type FormField = z.infer<typeof schema>;

export default function UpdateProfile() {
  const { t } = useTranslation('profile');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const updateUserProfileMutation = useUpdateUserProfile();
  const router = useRouter();
  const onSubmit = (data: FormField) => {
    updateUserProfileMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <SafeAreaView className='h-full'>
      <NavigationBar title={t('profile.basic_info')} />
      <View className='h-full w-full grow flex-col items-center justify-between px-4 pb-8 pt-10'>
        <View className='gap-y-20'>
          <ScrollView className='h-full'>
            <View className='flex h-full gap-y-4'>
              <ControllerInput
                props={{ name: 'username', control }}
                label={t('profile.username')}
                placeholder={t('placeholder.username')}
                error={errors.username}
              />

              <ControllerInput
                props={{ name: 'fullName', control }}
                label={t('profile.fullname')}
                placeholder={t('placeholder.fullname')}
                error={errors.fullName}
              />

              <ControllerInput
                props={{ name: 'dob', control }}
                type='date'
                label={t('profile.dob')}
                placeholder={t('placeholder.dob')}
                error={errors.dob}
              />

              <ControllerInput
                type='select'
                props={{ name: 'gender', control }}
                label={t('profile.gender')}
                placeholder={t('placeholder.gender')}
                defaultLabel={t('placeholder.gender')}
                options={[
                  { value: GenderEnum.MALE, label: t('gender.male') },
                  { value: GenderEnum.FEMALE, label: t('gender.female') },
                ]}
                error={errors.gender}
              />
            </View>
          </ScrollView>
          <Button
            onPress={handleSubmit(onSubmit)}
            size={'lg'}
            disabled={updateUserProfileMutation.isPending}
            className='absolute bottom-20 left-0 right-0'>
            <Text className='text-button'>{t('profile.done')}</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
