import { zodResolver } from '@hookform/resolvers/zod';
import { router, useFocusEffect } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { Colors } from '~/constants/Colors';
import Styles from '~/constants/GlobalStyles';
import { useSignOut } from '~/hooks/react-query/useAuth';
import { useUpdateUserProfile } from '~/hooks/react-query/useUser';
import { GLOBAL_STYLES } from '~/lib/constants';
import { GenderEnum } from '~/lib/enums';

const schema = z.object({
  username: z.string().min(3, 'error.username'),
  fullName: z.string().min(1, 'error.fullname'),
  dob: z
    .date()
    .min(new Date('1900-01-01'), { message: 'error.dob_min' })
    .max(new Date(), { message: `error.dob_max|${new Date().getFullYear()}` }),
  gender: z.nativeEnum(GenderEnum),
});

type FormField = z.infer<typeof schema>;

const UpdateProfile = () => {
  const { t } = useTranslation('profile');
  const signOut = useSignOut();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const updateUserProfileMutation = useUpdateUserProfile();
  const onSubmit = (data: FormField) => {
    updateUserProfileMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  // For keyboard avoiding
  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    AvoidSoftInput.setEnabled(true);
    return () => {
      AvoidSoftInput.setEnabled(false);
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);
  useFocusEffect(onFocusEffect);

  return (
    <PlatformView>
      <NavigationBar title={t('profile.basic_info')} />
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          paddingTop: 20,
          paddingBottom: Platform.OS === 'ios' ? 0 : 16,
        }}>
        <View
          style={{
            gap: 16,
          }}>
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
            style={{ height: 54 }}
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
        <View
          style={{
            width: '100%',
            gap: 16,
          }}>
          <Button onPress={handleSubmit(onSubmit)} size='lg' disabled={updateUserProfileMutation.isPending}>
            <Text style={GLOBAL_STYLES.textButton}>{t('profile.done')}</Text>
          </Button>
          <Button
            onPress={() => signOut.mutate()}
            variant='link'
            size='lg'
            style={{
              flexDirection: 'row',
              gap: 4,
            }}>
            <Text
              style={{
                ...Styles.font.bold,
                ...Styles.fontSize.body,
                ...Styles.color.orange[500],
              }}>
              {t('sign_out')}
            </Text>
            <LogOut size={24} color={Colors.light['orange-500']} />
          </Button>
        </View>
      </View>
    </PlatformView>
  );
};

export default UpdateProfile;
