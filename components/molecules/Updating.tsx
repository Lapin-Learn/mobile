import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { firestore } from '~/lib/services';

import { ConfirmationModal } from './ConfirmationModal';

type AppInfo = {
  uniqueId: string;
  deviceModel: string;
  deviceBrand: string;
  systemName: string;
  systemVersion: string;
  appVersion: string;
};

type VersionProps = {
  version: string;
  force: boolean;
};

export const Updating = ({ visible, setVisible }: { visible: boolean; setVisible: (visible: boolean) => void }) => {
  const [appInfo, setAppInfo] = useState<AppInfo>();
  const [releaseVersion, setReleaseVersion] = useState<VersionProps>();
  const { t } = useTranslation();

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchAppInfo = async () => {
      const uniqueId = await DeviceInfo.getUniqueId();
      const deviceModel = DeviceInfo.getModel();
      const deviceBrand = DeviceInfo.getBrand();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const appVersion = DeviceInfo.getVersion();

      setAppInfo({ uniqueId, deviceModel, deviceBrand, systemName, systemVersion, appVersion });
      await firestore
        .collection('Version')
        .doc(Platform.OS)
        .get()
        .then((doc) => {
          const version = doc.data();
          setReleaseVersion({ version: version?.version, force: version?.force });
        });
    };

    fetchAppInfo();
  }, []);

  useEffect(() => {
    if (appInfo && releaseVersion && appInfo.appVersion !== releaseVersion.version) {
      setVisible(true);
    }
  }, [appInfo, releaseVersion]);

  const handleUpdate = () => {
    if (Platform.OS === 'android') {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.datn.lapinlearn');
    } else {
      Alert.alert('Update', 'Comming soon ...', [{ text: 'OK' }]);
    }
  };

  if (releaseVersion?.force === undefined) return null;

  return (
    <ConfirmationModal
      visible={visible}
      setVisible={setVisible}
      content={{
        title: t('update.title'),
        message: t('update.message'),
        confirmAction: handleUpdate,
        cancelAction: releaseVersion?.force ? undefined : handleCancel,
      }}
    />
  );
};
