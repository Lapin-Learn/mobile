import { zodResolver } from '@hookform/resolvers/zod';
import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import CustomTextInput from '~/components/molecules/form-input/CustomTextInput';
import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useUpdateUserProfile, useUserProfile } from '~/hooks/react-query/useUser';
import { GLOBAL_STYLES } from '~/lib/constants';
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
    <SafeAreaView
      style={{
        height: '100%',
        paddingVertical: Platform.OS === 'android' ? 44 : 0,
      }}>
      <NavigationBar headerTitle={t('profile.basic_info')} headerLeftShown />
      <View style={styles.root}>
        <View style={styles.form}>
          <ControllerInput
            props={{ name: 'fullName', control }}
            label={t('profile.fullname')}
            placeholder={t('placeholder.fullname')}
            error={errors.fullName}
            style={styles.controllerInput}
          />

          <ControllerInput
            props={{ name: 'username', control }}
            label={t('profile.username')}
            placeholder={t('placeholder.username')}
            error={errors.username}
            style={styles.controllerInput}
          />

          <View style={styles.changePassword}>
            <Text style={styles.passwordLabel}>{t('profile.password')}</Text>
            <View style={styles.changePasswordInput}>
              <CustomTextInput
                placeholder={t('placeholder.change_password')}
                value='password'
                editable={false}
                secureTextEntry={true}
                style={styles.controllerInput}
              />
              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={() => router.push('/edit-profile/change-password' as Href)}>
                <Text style={styles.changePasswordText}>{t('profile.change_password')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ControllerInput
            props={{ name: 'email', control }}
            label={t('profile.email')}
            placeholder={t('placeholder.email')}
            error={errors.email}
            editable={false}
            style={styles.controllerInput}
          />

          <ControllerInput
            type='date'
            props={{ name: 'dob', control }}
            label={t('profile.dob')}
            placeholder={t('placeholder.dob')}
            error={errors.dob}
            style={styles.controllerInput}
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
            style={styles.controllerInput}
          />
        </View>
        <View>
          <Button
            size='lg'
            onPress={handleSubmit(onSubmit)}
            disabled={!isFormChanged || updateUserProfileMutation.isPending}
            style={{ width: '100%' }}>
            <Text style={GLOBAL_STYLES.textButton}>{t('profile.update')}</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    height: '100%',
    rowGap: 24,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 16,
  },
  controllerInput: {
    height: 48,
  },
  changePasswordButton: {
    position: 'absolute',
    right: 12,
  },
  changePasswordText: { ...Styles.font.normal, ...Styles.fontSize.subhead, ...Styles.color.orange['500'] },
  passwordLabel: {
    ...Styles.font.semibold,
    ...Styles.color.neutral['900'],
    ...Styles.fontSize.body,
  },
  changePasswordInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  changePassword: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 4,
  },
});
export default UpdateProfile;
