import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useUpdateUserProfile, useUserProfile } from '~/hooks/react-query/useUser';
import { GenderEnum } from '~/lib/enums';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email'),
  fullName: z.string().optional(),
  dob: z
    .date()
    .min(new Date('1900-01-01'), { message: 'Invalid date' })
    .max(new Date(), { message: 'Invalid date' })
    .optional(),
  gender: z.string().optional(),
});

type FormField = z.infer<typeof schema>;

export default function UpdateProfile() {
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { data, isPending, error } = useUserProfile();
  const updateUserProfileMutation = useUpdateUserProfile();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormField>({
    defaultValues: {
      username: data?.username || '',
      password: 'password', // default password for display
      email: data?.email || '',
      fullName: data?.fullName || '',
      dob: data?.dob ? new Date(data.dob) : new Date(),
      gender: data?.gender || '',
    },
    resolver: zodResolver(schema),
  });
  const initialFormState = useRef(watch());
  const { t } = useTranslation('user');

  useEffect(() => {
    const subscription = watch((value) => {
      setIsFormChanged(JSON.stringify(value) !== JSON.stringify(initialFormState.current));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  if (!data) return <Text>{t('profile.notFound')}</Text>;
  if (isPending) return <Loading />;
  if (error) return <Text>{error.message}</Text>;

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    const updatedData = {
      fullName: data.fullName?.trim().replace(/\s+/g, ' '),
      username: data.username.trim().replace(/\s+/g, ' '),
      dob: data.dob,
      gender: data.gender as GenderEnum,
    };
    updateUserProfileMutation.mutate(updatedData);
  };

  return (
    <SafeAreaView className={`h-full ${Platform.OS === 'android' ? 'py-11' : ''}`}>
      <NavigationBar headerTitle={t('profile.title')} headerLeftShown />
      <View className='flex grow items-center px-4 pt-6'>
        <View className='flex h-full gap-6'>
          <View className='flex gap-4'>
            <ControllerInput
              className='h-12'
              props={{ name: 'fullName', control }}
              label={t('profile.fullName')}
              placeholder={t('placeholder.fullName')}
              error={errors.fullName}
            />
            <ControllerInput
              className='h-12'
              props={{ name: 'username', control }}
              label={t('profile.userName')}
              placeholder={t('placeholder.userName')}
              error={errors.username}
            />
            <ControllerInput
              className='h-12'
              mode='change-password'
              props={{ name: 'password', control }}
              label={t('profile.password')}
              placeholder={t('placeholder.changePassword')}
              error={errors.password}
            />
            <ControllerInput
              className='h-12'
              props={{ name: 'email', control }}
              label={t('profile.email')}
              placeholder={t('placeholder.email')}
              error={errors.email}
              isEditable={false}
            />
            <ControllerInput
              className='h-12'
              mode='datepicker'
              props={{ name: 'dob', control }}
              label={t('profile.dob')}
              placeholder={t('placeholder.dob')}
              error={errors.dob}
            />
            <ControllerInput
              mode='select'
              props={{ name: 'gender', control }}
              label={t('profile.gender')}
              defaultLabel={
                data.gender === GenderEnum.MALE
                  ? t('gender.male')
                  : data.gender === GenderEnum.FEMALE
                    ? t('gender.female')
                    : t('placeholder.gender')
              }
              placeholder={t('placeholder.gender')}
              options={[
                { value: GenderEnum.MALE, label: t('gender.male') },
                { value: GenderEnum.FEMALE, label: t('gender.female') },
              ]}
              error={errors.gender}
            />
          </View>
          <View>
            <Button
              size='lg'
              onPress={handleSubmit(onSubmit)}
              disabled={!isFormChanged || updateUserProfileMutation.isPending}>
              <Text className='text-body font-semibold text-white'>{t('profile.update')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
