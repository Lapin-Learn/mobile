import { Href, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { LogOut } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Avatar from '~/components/molecules/avatar';
import { ProfileSection } from '~/components/molecules/profile/ProfileSection';
import { ChangeLanguageModal } from '~/components/organisms/modals/ChangeLanguageModal';
import { DeleteAccountModal } from '~/components/organisms/modals/DeleteAccountModal';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { default as Styles } from '~/constants/GlobalStyles';
import { useSignOut } from '~/hooks/react-query/useAuth';
import { useDeleteAccount, useUserProfile } from '~/hooks/react-query/useUser';
import { firestore } from '~/lib/services';

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
  const deleteAccount = useDeleteAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  firestore
    .collection('Screen')
    .doc('profile')
    .onSnapshot((docSnapshot) => {
      const showDeleteAccount = docSnapshot.data()?.showDeleteAccount;
      setShowDeleteAccount(showDeleteAccount);
    });

  const profileData = useMemo(() => {
    const defaultValue = '--';
    return [
      { label: 'profile.fullname', value: data?.fullName || defaultValue },
      { label: 'profile.username', value: data?.username || defaultValue },
      { label: 'profile.email', value: data?.email || defaultValue },
    ];
  }, [data]);

  if (error) {
    return <Text>{error.message}</Text>;
  }

  const handleDeleteAccount = () => {
    deleteAccount.mutate();
  };

  return (
    <PlatformView style={{ paddingBottom: 0 }}>
      <ScrollView>
        <View style={styles.root}>
          <View style={styles.avatarSection}>
            <Avatar />
            {isFetching ? (
              <>
                <Skeleton height={33} width={200} colorMode='light' />
                <Skeleton height={20} width={240} colorMode='light' />
              </>
            ) : (
              <>
                <LongName {...profileData[0]} />
                <Text style={styles.email}>{profileData[2].value}</Text>
              </>
            )}
          </View>

          <ProfileSection>
            <ProfileSection.Title label={t('profile.basic_info')} textStyle={{ ...Styles.fontSize['title-4'] }}>
              {!isFetching && (
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
              )}
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
            <DeleteAccountModal
              visible={isModalVisible}
              setVisible={setIsModalVisible}
              content={{
                title: t('settings.delete_account.title'),
                message: t('settings.delete_account.description'),
                confirmText: t('settings.delete_account.delete_button'),
                cancelText: t('settings.delete_account.cancel_button'),
                isPending: deleteAccount.isPending,
                confirmAction: handleDeleteAccount,
                cancelAction: () => setIsModalVisible(false),
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

  if (value.length === 0) {
    return <Text style={styles.username}>{'--'}</Text>;
  }

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
          <DeleteAccountModal
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
    ...Styles.fontSize['title-2'],
    ...Styles.color.dark,
  },
  email: {
    ...Styles.color.supportingText,
    ...Styles.fontSize.callout,
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
    gap: 8,
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
