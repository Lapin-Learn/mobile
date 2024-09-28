import { Href, router } from 'expo-router';
import { Camera, ChevronRight, LogOut } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';
import { ProfileSection } from '~/components/molecules/profile/ProfileSection';
import { Button } from '~/components/ui/Button';
import { Colors } from '~/constants/Colors';
import { useSignOut } from '~/hooks/react-query/useAuth';
import { useUserProfile } from '~/hooks/react-query/useUser';

export default function Index() {
  const { t } = useTranslation('profile');
  const { data, isFetching, error } = useUserProfile();
  const signOut = useSignOut();

  const handleEdit = () => {
    router.push('/profile/edit' as Href);
  };

  const handleChangeAvatar = () => {
    Alert.alert(t('profile.changeAvatar'));
  };

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  const profileData = [
    { label: 'profile.fullname', value: data?.fullName ?? 'default' },
    { label: 'profile.username', value: data?.username ?? 'default' },
    { label: 'profile.email', value: data?.email ?? 'default' },
    { label: 'profile.phone', value: data?.phone ?? 'default' },
  ];

  const settingsData = [
    { label: 'settings.custom_settings', action: () => {} },
    { label: 'settings.notifications', action: () => {} },
    { label: 'settings.social_accounts', action: () => {} },
    { label: 'settings.privacy_settings', action: () => {} },
  ];

  return (
    <PlatformView>
      <NavigationBar headerLeftShown />
      <ScrollView>
        <View className='gap-y-10 p-4 pt-0'>
          <View className='items-center justify-center'>
            <View className='items-end justify-end'>
              <View className='h-22 w-22 overflow-hidden rounded-full'>
                {/* <Image className='h-full w-full' source={{ uri: 'https://via.placeholder.com/48' }} /> */}
                <Skeleton width='100%' height='100%' colorMode='light' />
              </View>
              <Button
                variant='link'
                className='absolute z-10 m-0 h-6 w-6 items-center justify-center rounded-full bg-white p-0'
                onPress={handleChangeAvatar}>
                <Camera size={16} color={Colors.light['orange-500']} />
              </Button>
            </View>
            <Text className='text-title-1 font-bold text-black'>{profileData[0].value}</Text>
            <Text className='text-body text-supporting-text'>{profileData[1].value}</Text>
          </View>

          <ProfileSection>
            <ProfileSection.Title label={t('profile.basic_info')}>
              <Button variant='link' size='sm' onPress={handleEdit}>
                <Text className='text-subhead text-orange-500'>{t('profile.edit')}</Text>
              </Button>
            </ProfileSection.Title>
            <ProfileSection.Group className='gap-y-2.5 rounded border border-neutral-100 p-4'>
              {profileData.map((item, index) => (
                <ProfileSection.Item key={index} label={t(item.label)} value={item.value} />
              ))}
            </ProfileSection.Group>
          </ProfileSection>

          <ProfileSection>
            <ProfileSection.Title label={t('settings.title')} />
            <ProfileSection.List
              data={settingsData.map((item) => ({ label: t(item.label), action: item.action }))}
              rightIcon={ChevronRight}
            />
          </ProfileSection>

          <Button onPress={() => signOut.mutate()} variant='link' className='flex-row gap-x-1 px-5 py-3.5'>
            <Text className='text-body font-bold text-orange-500 '>{t('sign_out')}</Text>
            <LogOut size={24} color={Colors.light['orange-500']} />
          </Button>
        </View>
      </ScrollView>
    </PlatformView>
  );
}
