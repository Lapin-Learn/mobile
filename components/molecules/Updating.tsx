import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Styles from '~/constants/GlobalStyles';
import { firestore } from '~/lib/services';

import { Button } from '../ui/Button';

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

export const Updating = () => {
  const [appInfo, setAppInfo] = useState<AppInfo>();
  const [releaseVersion, setReleaseVersion] = useState<VersionProps>();
  const [visible, setVisible] = useState(false);
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
    if (appInfo && appInfo.appVersion !== releaseVersion?.version) {
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
    <Modal animationType='fade' transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('update.title')}</Text>
          <Text style={styles.message}>{t('update.message')}</Text>
          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>{t('update.button')}</Text>
            </Button>
            {releaseVersion?.force || (
              <Button style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>{t('update.cancel')}</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-2'],
    marginBottom: 10,
  },
  message: {
    ...Styles.fontSize.body,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#ee5d28',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-4'],
    ...Styles.color.white,
  },
  cancelButtonText: {
    ...Styles.color.black,
  },
});
