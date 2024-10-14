import { zodResolver } from '@hookform/resolvers/zod';
import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import CustomTextInput from '~/components/molecules/CustomTextInput';
import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useUpdateUserProfile, useUserProfile } from '~/hooks/react-query/useUser';
import { GenderEnum } from '~/lib/enums';

// TODO
const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  gender: z.nativeEnum(GenderEnum),
  fullName: z.string().optional(),
  dob: z
    .date()
    .min(new Date('1900-01-01'), { message: 'Invalid date' })
    .max(new Date(), { message: 'Invalid date' })
    .optional(),
});

type FormField = z.infer<typeof schema>;

const UpdateProfile = () => {
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
      email: data?.email || '',
      fullName: data?.fullName || '',
      dob: data?.dob ? new Date(data.dob) : new Date(),
      gender: data?.gender || GenderEnum.MALE,
    },
    resolver: zodResolver(schema),
  });
  const initialFormState = useRef(watch());
  const { t } = useTranslation('profile');

  useEffect(() => {
    const subscription = watch((value) => {
      setIsFormChanged(JSON.stringify(value) !== JSON.stringify(initialFormState.current));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  if (!data) return <Text>{t('profile.not_found')}</Text>;
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
      <NavigationBar headerTitle={t('profile.basic_info')} headerLeftShown />
      <View className='flex grow items-center px-4 pt-6'>
        <View className='flex h-full gap-6'>
          <View className='flex gap-4'>
            <ControllerInput
              className='h-12'
              props={{ name: 'fullName', control }}
              label={t('profile.fullname')}
              placeholder={t('placeholder.fullname')}
              error={errors.fullName}
            />

            <ControllerInput
              className='h-12'
              props={{ name: 'username', control }}
              label={t('profile.username')}
              placeholder={t('placeholder.username')}
              error={errors.username}
            />

            <View className='w-full flex-col items-start justify-start gap-1'>
              <Text className='text-lg font-semibold text-neutral-900'>{t('profile.password')}</Text>
              <View className='flex w-full grow flex-row items-center justify-center rounded-md'>
                <CustomTextInput
                  className='h-12'
                  placeholder={t('placeholder.change_password')}
                  value={'password'}
                  editable={false}
                  secureTextEntry
                  style={{ color: 'black' }}
                />
                <TouchableOpacity
                  className='absolute right-3 top-1/2 -translate-y-1/2 transform'
                  onPress={() => router.push('/edit-profile/change-password' as Href)}>
                  <Text className='text-subhead text-orange-500'>{t('profile.change_password')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ControllerInput
              className='h-12'
              props={{ name: 'email', control }}
              label={t('profile.email')}
              placeholder={t('placeholder.email')}
              error={errors.email}
              editable={false}
            />

            <ControllerInput
              className='h-12 text-black'
              type='date'
              props={{ name: 'dob', control }}
              label={t('profile.dob')}
              placeholder={t('placeholder.dob')}
              error={errors.dob}
            />

            <ControllerInput
              type='select'
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
              <Text className='text-button'>{t('profile.update')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfile;
