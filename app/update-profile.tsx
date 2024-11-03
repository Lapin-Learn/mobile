import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { Colors } from '~/constants/Colors';
import Styles from '~/constants/GlobalStyles';
import { useSignOut } from '~/hooks/react-query/useAuth';
import { useUpdateUserProfile } from '~/hooks/react-query/useUser';
import { GLOBAL_STYLES } from '~/lib/constants';
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

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <NavigationBar title={t('profile.basic_info')} />
      <View
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
          paddingBottom: 16,
          paddingTop: 20,
        }}>
        <View style={{ gap: 80 }}>
          <ScrollView
            style={{
              height: '100%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                columnGap: 16,
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
          </ScrollView>
          <View style={{ position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', gap: 16 }}>
            <Button onPress={handleSubmit(onSubmit)} size='lg' disabled={updateUserProfileMutation.isPending}>
              <Text style={GLOBAL_STYLES.textButton}>{t('profile.done')}</Text>
            </Button>
            <Button
              onPress={() => signOut.mutate()}
              variant='link'
              style={{ flexDirection: 'row', rowGap: 4, paddingVertical: 14, paddingHorizontal: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, ...Styles.color.orange[500] }}>{t('sign_out')}</Text>
              <LogOut size={24} color={Colors.light['orange-500']} />
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfile;
