import * as ImagePicker from 'expo-image-picker';
import { Href, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Camera, LogOut } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { ProfileSection } from '~/components/molecules/profile/ProfileSection';
import { ChangeLanguageModal } from '~/components/organisms/modals/ChangeLanguageModal';
import { ConfirmationModal } from '~/components/organisms/modals/ConfirmationModal';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { default as Styles } from '~/constants/GlobalStyles';
import { useSignOut } from '~/hooks/react-query/useAuth';
import {
  useCreatePreSignedUrl,
  useCreateUpdatePreSignedUrl,
  useDeleteAccount,
  useUpdateUserProfile,
  useUploadAvatar,
  useUserProfile,
} from '~/hooks/react-query/useUser';
import { useToast } from '~/hooks/useToast';
import { firestore } from '~/lib/services';
import { IPresignedUrl } from '~/lib/types';

const termsData = [
  {
    label: 'terms.privacy_policy',
    action: async () => {
      await WebBrowser.openBrowserAsync(`${process.env.EXPO_PUBLIC_URL_ENDPOINT}/privacy-policy`);
    },
  },
  {
    label: 'terms.feedback',
    action: async () => {
      await WebBrowser.openBrowserAsync(`${process.env.EXPO_PUBLIC_URL_FORM_CONTACT}`);
    },
  },
];

const Index = () => {
  const { t } = useTranslation('profile');
  const { data, isFetching, error } = useUserProfile();
  const signOut = useSignOut();
  const createPreSignedUrl = useCreatePreSignedUrl();
  const uploadAvatar = useUploadAvatar();
  const updateUserProfile = useUpdateUserProfile();
  const createUpdatePreSignedUrl = useCreateUpdatePreSignedUrl();
  const deleteAccount = useDeleteAccount();
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [image, setImage] = useState('https://via.placeholder.com/48');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toast = useToast();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showChangeLanguage, setShowChangeLanguage] = useState(false);

  const settingsData = [
    {
      label: t('settings.change_language.title'),
      visible: true,
      action: () => setShowChangeLanguage(true),
    },
    { label: t('settings.delete_account.title'), action: () => setIsModalVisible(true), visible: showDeleteAccount },
    {
      label: t('sign_out'),
      action: () => signOut.mutate(),
      rightIcon: LogOut,
      style: {
        ...Styles.color.red['500'],
      },
      visible: true,
    },
  ];

  const handleEdit = () => {
    router.push('/edit-profile' as Href);
  };

  useEffect(() => {
    if (data?.avatar) {
      setImage(data.avatar.url);
    }
  }, [data]);

  firestore
    .collection('Screen')
    .doc('profile')
    .onSnapshot((docSnapshot) => {
      const showDeleteAccount = docSnapshot.data()?.showDeleteAccount;
      setShowDeleteAccount(showDeleteAccount);
    });

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
    { label: 'profile.fullname', value: data?.fullName ?? data?.username ?? 'default' },
    { label: 'profile.username', value: data?.username ?? 'default' },
    { label: 'profile.email', value: data?.email ?? 'default' },
  ];

  const handleDeleteAccount = () => {
    deleteAccount.mutate();
  };

  return (
    <PlatformView>
      <ScrollView>
        <View style={styles.root}>
          <View style={styles.avatarSection}>
            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <View style={styles.avatar}>
                {isAvatarChanged ? (
                  <Skeleton width='100%' height='100%' colorMode='light' />
                ) : (
                  <Image style={{ width: '100%', height: '100%' }} source={{ uri: image }} />
                )}
              </View>
              <Button variant='link' style={styles.avatarButton} onPress={handleChangeAvatar}>
                <Camera size={16} {...Styles.color.neutral[400]} />
              </Button>
            </View>
            <LongName {...profileData[0]} />
            <Text style={styles.email}>{profileData[2].value}</Text>
          </View>

          <ProfileSection>
            <ProfileSection.Title label={t('profile.basic_info')} textStyle={{ ...Styles.fontSize['title-4'] }}>
              <Button variant='link' size='sm' onPress={handleEdit} style={{ width: 'auto' }}>
                <Text
                  style={{
                    ...Styles.font.normal,
                    ...Styles.fontSize.subhead,
                    ...Styles.color.orange['500'],
                  }}>
                  {t('profile.edit')}
                </Text>
              </Button>
            </ProfileSection.Title>
            <ProfileSection.Group style={styles.profileGroup}>
              {profileData.map((item, index) => (
                <ProfileSection.Item key={index} label={t(item.label)} value={item.value} />
              ))}
            </ProfileSection.Group>
          </ProfileSection>

          <ProfileSection>
            <ProfileSection.Title
              label={t('terms.title', { ns: 'translation' })}
              textStyle={{ ...Styles.fontSize['title-4'] }}
            />
            <ProfileSection.List
              data={[
                ...termsData.map((item) => ({ label: t(item.label, { ns: 'translation' }), action: item.action })),
              ]}
            />
          </ProfileSection>

          {isModalVisible && showDeleteAccount && (
            <ConfirmationModal
              visible={isModalVisible}
              setVisible={setIsModalVisible}
              content={{
                title: t('settings.delete_account.title'),
                message: t('settings.delete_account.description'),
                cancelText: t('settings.delete_account.delete_button'),
                confirmText: t('settings.delete_account.cancel_button'),
                isPending: deleteAccount.isPending,
                cancelAction: handleDeleteAccount,
                confirmAction: () => setIsModalVisible(false),
              }}
            />
          )}
          <ChangeLanguageModal onClose={setShowChangeLanguage} showModal={showChangeLanguage} />
          <ProfileSection style={{ marginBottom: 32 }}>
            <ProfileSection.Title label={t('settings.title')} textStyle={{ ...Styles.fontSize['title-4'] }} />
            <ProfileSection.List data={settingsData.filter((data) => data.visible)} />
          </ProfileSection>
        </View>
      </ScrollView>
    </PlatformView>
  );
};

const LongName = ({ label, value }: { label: string; value: string }) => {
  const { t } = useTranslation('profile');
  const [isLongName, setIsLongName] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (value.length > 16) {
      setIsLongName(true);
    }
  }, [value]);

  const LongNamePressable = ({ children }: { children: React.ReactNode }) => {
    return isLongName ? (
      <Pressable onPress={() => setShowTooltip(!showTooltip)}>{children}</Pressable>
    ) : (
      <>{children}</>
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {
          <LongNamePressable>
            <Text style={styles.username} numberOfLines={1} ellipsizeMode='tail'>
              {isLongName ? `${value.substring(0, 16)}...` : value}
            </Text>
          </LongNamePressable>
        }
        {showTooltip && (
          <ConfirmationModal
            visible={showTooltip}
            setVisible={setShowTooltip}
            type='tooltip'
            content={{
              title: t(label),
              message: value,
              isPending: false,
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileGroup: {
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    ...Styles.borderColor.border,
    ...Styles.backgroundColor.white,
  },
  root: {
    gap: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    height: 96,
    width: 96,
    borderRadius: 999,
    overflow: 'hidden',
  },
  username: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-1'],
    ...Styles.color.dark,
  },
  email: {
    ...Styles.color.supportingText,
    ...Styles.fontSize.body,
  },
  avatarButton: {
    position: 'absolute',
    margin: 0,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'white',
  },
  avatarSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonSignOut: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSignOutText: {
    ...Styles.color.orange['500'],
    ...Styles.font.bold,
    ...Styles.fontSize.body,
  },
});
export default Index;
