import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { firestore } from '~/lib/services';
import { getTurnOffUpdatePopupAsync, setTurnOffUpdatePopupAsync } from '~/services';

import { ConfirmationModal } from '../organisms/modals/ConfirmationModal';

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

const appStoreLinks: Record<Platform['OS'], string> = {
  android: 'https://play.google.com/store/apps/details?id=com.datn.lapinlearn',
  ios: 'https://apps.apple.com/vn/app/lapinlearn/id6739158736',
  windows: '',
  macos: '',
  web: '',
};

export const Updating = ({ visible, setVisible }: { visible: boolean; setVisible: (visible: boolean) => void }) => {
  const [appInfo, setAppInfo] = useState<AppInfo>();
  const [releaseVersion, setReleaseVersion] = useState<VersionProps>();
  const { t } = useTranslation();

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
    const checkUpdatePopup = async () => {
      const turnOffUpdatePopup = await getTurnOffUpdatePopupAsync();
      if (appInfo && releaseVersion && appInfo.appVersion !== releaseVersion.version) {
        const appVersions = appInfo.appVersion.split('.');
        const releaseVersions = releaseVersion.version.split('.');
        let shouldVisible = false;
        for (let i = 0; i < appVersions.length; i++) {
          if (parseInt(appVersions[i]) < parseInt(releaseVersions[i])) {
            shouldVisible = true;
            break;
          } else if (parseInt(appVersions[i]) > parseInt(releaseVersions[i])) {
            break;
          }
        }
        if (shouldVisible) {
          if (releaseVersion.force) {
            setVisible(true);
            return;
          } else {
            if (turnOffUpdatePopup === null) {
              setVisible(true);
            }
          }
        }
      }
    };

    checkUpdatePopup();
  }, [appInfo, releaseVersion]);

  const handleCancel = () => {
    setVisible(false);
    if (releaseVersion?.version) setTurnOffUpdatePopupAsync(releaseVersion?.version);
  };

  const handleUpdate = () => {
    Linking.openURL(appStoreLinks[Platform.OS]);
  };

  if (releaseVersion?.force === undefined) return null;

  return (
    <>
      {releaseVersion?.force && (
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
      )}
      {!releaseVersion?.force && (
        <ConfirmationModal
          visible={visible}
          setVisible={setVisible}
          content={{
            title: t('update.title'),
            message: t('update.message'),
            confirmAction: handleUpdate,
            cancelAction: handleCancel,
          }}
        />
      )}
    </>
  );
};
