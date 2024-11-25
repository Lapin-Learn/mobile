import { Audio } from 'expo-av';
import { Mic, Pause, Play, RotateCcw, Send } from 'lucide-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { useSpeakingEvaluation } from '~/hooks/react-query/useDailyLesson';
import { SpeakingSoundType, useSpeakingStore } from '~/hooks/zustand';
import { configureRecordSession, recordingOptions } from '~/lib/config';
import { GLOBAL_STYLES } from '~/lib/constants';
import { deleteUri } from '~/lib/utils/fileSystem';

import { IconComponent } from './Icon';

export const RecordBar = ({ question }: { question: string }) => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const evaluate = useSpeakingEvaluation();
  const { recording, status, uri, soundType, setResult, setRecord, stopRecord, setUri, setSoundType, initState } =
    useSpeakingStore();
  const { t } = useTranslation('question');
  const { height } = Dimensions.get('window');

  useEffect(() => {
    return () => {
      stopRecord();
      initState();
    };
  }, []);

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

      if (uri) deleteUri(uri!);

      const recordObject = await Audio.Recording.createAsync(recordingOptions);
      setRecord({ recording: recordObject.recording, status: recordObject.status });
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      if (recording) {
        stopRecord();
        const uri = recording.getURI();
        setUri({ uri });
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function sendRecording() {
    // TODO: get Result IPA
    evaluate.mutate(
      { original: question, uri: uri! },
      {
        onSuccess(data) {
          setResult({
            correct_letters: data.correct_letters,
            original_transcript: data.original_transcript,
            original_ipa_transcript: data.original_ipa_transcript,
          });
          deleteUri(uri!);
          setSoundType(SpeakingSoundType.SEND);
        },
      }
    );

    // Result after mutate
  }

  const handleReplay = () => {
    if (soundType !== SpeakingSoundType.IDLE) {
      setSoundType(SpeakingSoundType.IDLE);
    }
    uri && startRecording();
  };

  const handlePlaySound = () =>
    setSoundType(soundType === SpeakingSoundType.ANSWER ? SpeakingSoundType.IDLE : SpeakingSoundType.ANSWER);

  const Component = status?.isRecording ? Pressable : View;

  return (
    <Component
      style={[GLOBAL_STYLES.checkButtonView, styles.containerRecord, { height: height * 0.2 }]}
      onPress={stopRecording}>
      {uri && !recording && <IconComponent icon={RotateCcw} onPress={handleReplay} />}
      {status?.isRecording ? (
        <Text style={styles.textRecording}>{t('recording.recorded')}</Text>
      ) : (
        <IconComponent
          name={uri ? 'Send' : 'Mic'}
          icon={uri ? Send : Mic}
          size={48}
          color={Styles.color.white.color}
          onPress={uri ? sendRecording : startRecording}
          disabled={status?.isRecording || evaluate.isPending}
        />
      )}
      {!status?.isRecording && uri && (
        <IconComponent icon={soundType === SpeakingSoundType.ANSWER ? Pause : Play} onPress={handlePlaySound} />
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  containerRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingBottom: Platform.OS === 'ios' ? 0 : 40,
  },
  textRecording: {
    ...Styles.color.neutral[300],
    ...Styles.font.bold,
    ...Styles.fontSize.body,
  },
});
