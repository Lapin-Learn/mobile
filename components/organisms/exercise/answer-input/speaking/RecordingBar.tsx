import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Mic, Pause, Play, RotateCcw, Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { SpeakingSoundType, useAudioStore } from '~/hooks/zustand/useAudioStore';
import { configureRecordSession, recordingOptions } from '~/lib/config';
import { GLOBAL_STYLES } from '~/lib/constants';
import { deleteUri } from '~/lib/utils/fileSystem';

import { IconComponent } from './Icon';

export const RecordBar = () => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const { recording, status, uri, soundType, setRecord, setUri, setSoundType } = useAudioStore();
  const { t } = useTranslation('question');

  async function startRecording() {
    try {
      if (permissionResponse && !permissionResponse.granted) {
        if (permissionResponse.canAskAgain) {
          await requestPermission();
        } else {
          Alert.alert(t('recording.permission.title'), t('recording.permission.message'), [
            {
              text: t('recording.openSettings'),
              onPress: () => Linking.openSettings(),
            },
            { text: t('recording.cancel'), style: 'cancel' },
          ]);
        }
      }

      await configureRecordSession();

      deleteUri(uri!);

      const recordObject = await Audio.Recording.createAsync(recordingOptions);
      setRecord({ recording: recordObject.recording, status: recordObject.status });
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });

        const uri = recording.getURI();
        setUri({ uri });
        setRecord({ recording: undefined, status: undefined });
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function sendRecording() {
    Alert.alert('Recording Sent', 'Your recording has been sent to the backend');
    const audioData = await FileSystem.readAsStringAsync(uri!, { encoding: FileSystem.EncodingType.Base64 });
    const blob = new Blob([audioData], { type: 'audio/m4a' });

    const formData = new FormData();
    formData.append('audio', blob, 'audio.m4a');

    setSoundType(SpeakingSoundType.SEND);
  }
  return (
    <View style={[GLOBAL_STYLES.checkButtonView, styles.containerRecord]}>
      {uri && !recording && <IconComponent icon={RotateCcw} onPress={() => uri && startRecording()} />}

      {status?.isRecording ? (
        <Pressable onPress={stopRecording}>
          <Text style={styles.textRecording}>{t('recording.recorded')}</Text>
        </Pressable>
      ) : (
        <IconComponent
          name={uri ? 'Send' : 'Mic'}
          icon={uri ? Send : Mic}
          size={48}
          color={Styles.color.white.color}
          onPress={uri ? sendRecording : startRecording}
        />
      )}
      {!status?.isRecording && uri && (
        <IconComponent
          icon={soundType === SpeakingSoundType.ANSWER ? Pause : Play}
          onPress={() =>
            setSoundType(soundType === SpeakingSoundType.ANSWER ? SpeakingSoundType.IDLE : SpeakingSoundType.ANSWER)
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  textRecording: { ...Styles.color.neutral[300], ...Styles.font.bold, ...Styles.fontSize.body },
});
