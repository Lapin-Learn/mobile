import { Href, router } from 'expo-router';
import { Camera, ChevronRight, LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';
import { ProfileSection } from '~/components/molecules/profile/ProfileSection';
import { Button } from '~/components/ui/Button';
import { Colors } from '~/constants/Colors';
import { useSignOut } from '~/hooks/react-query/useAuth';
import { cn } from '~/lib/utils';

const profileData = [
  { label: 'profile.username', value: 'Ngân Trúc' },
  { label: 'profile.email', value: 'ngantruc2003@gmail.com' },
  { label: 'profile.phone', value: '+84 123 456 789' },
];

const settingsData = [
  { action: () => {}, label: 'settings.username' },
  { action: () => {}, label: 'settings.notifications' },
  { action: () => {}, label: 'settings.social_accounts' },
  { action: () => {}, label: 'settings.privacy_settings' },
];

export default function Index() {
  const { t } = useTranslation('profile');
  const signOut = useSignOut();

  const handleEdit = () => {
    router.push('/profile/edit' as Href);
  };

  const handleChangeAvatar = () => {
    Alert.alert(t('profile.changeAvatar'));
  };

  return (
    <PlatformView>
      <NavigationBar headerLeftShown />
      <ScrollView>
        <View className='gap-y-10 px-4'>
          {/* Avatar */}
          <View className='items-center justify-center'>
            <View className='items-end justify-end'>
              <Image className='h-22 w-22 rounded-full' source={{ uri: 'https://via.placeholder.com/48' }} />
              <Button
                variant={'link'}
                className='absolute z-10 m-0 h-6 w-6 items-center justify-center rounded-full bg-white p-0'
                onPress={handleChangeAvatar}>
                <Camera size={16} color={Colors.light['orange-500']} />
              </Button>
            </View>
            <Text className='text-title-1 font-bold text-black'>Ngân Trúc</Text>
            <Text className='text-body text-supporting-text'>ngantruc2003@gmail.com</Text>
          </View>

          {/* Profile */}
          <ProfileSection>
            <ProfileSection.Title label={t('profile.basic_info')}>
              <Button variant={'link'} size={'sm'} onPress={handleEdit}>
                <Text className='text-subhead text-orange-500'>{t('profile.edit')}</Text>
              </Button>
            </ProfileSection.Title>
            <ProfileSection.Group className='gap-y-2.5 rounded border border-neutral-100 p-4'>
              {profileData.map((item, index) => (
                <ProfileSection.Item key={index} label={t(item.label)} value={item.value} />
              ))}
            </ProfileSection.Group>
          </ProfileSection>

          {/* Settings */}
          <ProfileSection>
            <ProfileSection.Title label={t('settings.title')} />
            <View>
              {settingsData.map((item, index) => (
                <ProfileSection.Item
                  key={index}
                  className={cn(
                    'border border-neutral-100 p-4',
                    index === 0 && 'rounded-t',
                    index === settingsData.length - 1 && 'rounded-b'
                  )}>
                  <TouchableOpacity className='w-full flex-row items-center justify-between'>
                    <Text className='text-body font-semibold'>{t(item.label)}</Text>
                    <ChevronRight size={24} color={Colors.light['neutral-100']} />
                  </TouchableOpacity>
                </ProfileSection.Item>
              ))}
            </View>
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
