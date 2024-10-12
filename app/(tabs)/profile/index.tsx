import * as ImagePicker from 'expo-image-picker';
import { Href, router } from 'expo-router';
import { Camera, ChevronRight, LogOut } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { ProfileSection } from '~/components/molecules/profile/ProfileSection';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { Colors } from '~/constants/Colors';
import { useSignOut } from '~/hooks/react-query/useAuth';
import {
  useCreatePreSignedUrl,
  useCreateUpdatePreSignedUrl,
  useUpdateUserProfile,
  useUploadAvatar,
  useUserProfile,
} from '~/hooks/react-query/useUser';
import { useToast } from '~/hooks/useToast';
import { IPresignedUrl } from '~/lib/types';

const Index = () => {
  const { t } = useTranslation('profile');
  const { data, isFetching, error } = useUserProfile();
  const signOut = useSignOut();
  const createPreSignedUrl = useCreatePreSignedUrl();
  const uploadAvatar = useUploadAvatar();
  const updateUserProfile = useUpdateUserProfile();
  const createUpdatePreSignedUrl = useCreateUpdatePreSignedUrl();
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [image, setImage] = useState('https://via.placeholder.com/48');
  const toast = useToast();

  const handleEdit = () => {
    router.push('/edit-profile' as Href);
  };

  useEffect(() => {
    if (data?.avatar) {
      setImage(data.avatar.url);
    }
  }, [data]);

  const handleChangeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setIsAvatarChanged(true);

      const arrBuffer = new Uint8Array(
        atob(result.assets[0].base64 || '')
          .split('')
          .map((c) => c.charCodeAt(0))
      ).buffer;

      try {
        let presignedUrl: IPresignedUrl = { id: '', url: '' };
        if (!data?.avatar) {
          presignedUrl = await createPreSignedUrl.mutateAsync({ name: result.assets[0].fileName || 'test.jpg' });
        } else {
          presignedUrl = await createUpdatePreSignedUrl.mutateAsync({
            name: result.assets[0].fileName || 'test.jpg',
            uuid: data.avatar.id || '',
          });
        }
        await uploadAvatar.mutateAsync({ presignedUrl, file: arrBuffer }).then(async () => {
          await updateUserProfile.mutateAsync({ avatarId: presignedUrl.id });
          setIsAvatarChanged(false);
          setImage(result.assets[0].uri);
        });
      } catch (error) {
        console.error(error);
        setIsAvatarChanged(false);
        toast.show({ type: 'error', text1: 'Failed to upload avatar' });
      }
    }
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
  ];

  const settingsData = [
    {
      label: 'settings.custom_settings',
      action: () => {},
    },
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
                {isAvatarChanged ? (
                  <Skeleton width='100%' height='100%' colorMode='light' />
                ) : (
                  <Image className='h-full w-full' source={{ uri: image }} />
                )}
              </View>
              <Button
                variant='link'
                className='absolute z-10 m-0 h-6 w-6 items-center justify-center rounded-full bg-white p-0'
                onPress={handleChangeAvatar}>
                <Camera size={16} color={Colors.light['orange-500']} />
              </Button>
            </View>
            <Text className='font-ibold text-title-1 text-black'>{profileData[1].value}</Text>
            <Text className='text-body text-supporting-text'>{profileData[2].value}</Text>
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
            <Text className='font-ibold text-body text-orange-500 '>{t('sign_out')}</Text>
            <LogOut size={24} color={Colors.light['orange-500']} />
          </Button>
        </View>
      </ScrollView>
    </PlatformView>
  );
};

export default Index;
