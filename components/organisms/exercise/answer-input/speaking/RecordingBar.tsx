import { Audio } from 'expo-av';
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import Send from '~/assets/images/send.svg';
import SpeakingFilled from '~/assets/images/skills/speaking-filled.svg';
import { RiveWave } from '~/components/molecules/rive/Wave';
import Styles from '~/constants/GlobalStyles';
import { useSpeakingEvaluation } from '~/hooks/react-query/useDailyLesson';
import { SpeakingSoundType, useSpeakingStore } from '~/hooks/zustand';
import { configureRecordSession, recordingOptions } from '~/lib/config';
import { bottomButtonToScreen } from '~/lib/constants/padding';
import { deleteUri } from '~/lib/utils/fileSystem';

import { IconComponent } from './Icon';

type RecordBarProps = {
  question: string;
  evaluate: ReturnType<typeof useSpeakingEvaluation>;
};

export const RecordBar = ({ question, evaluate }: RecordBarProps) => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const { recording, status, uri, soundType, setResult, setRecord, stopRecord, setUri, setSoundType, initState } =
    useSpeakingStore();
  const { t } = useTranslation('question');

  useEffect(() => {
    return () => {
      stopRecord();
      initState();
    };
  }, []);

  useEffect(() => {
    if (soundType === SpeakingSoundType.QUESTION) {
      stopRecord();
    }
  }, [soundType]);

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
    <Component style={styles.containerRecord} onPress={stopRecording}>
      {uri && !recording && (
        <IconComponent onPress={handleReplay} disabled={evaluate.isPending}>
          <RotateCcw size={24} color={Styles.color.orange[700].color} />
        </IconComponent>
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 96,
        }}>
        {status?.isRecording ? (
          <>
            <RiveWave style={styles.rive} />
            <Text style={styles.textRecording}>{t('recording.recorded')}</Text>
          </>
        ) : (
          <IconComponent
            name={uri ? 'Send' : 'Mic'}
            style={{ height: 80, width: 80, aspectRatio: 1 }}
            color={Styles.color.white.color}
            onPress={uri ? sendRecording : startRecording}
            disabled={status?.isRecording || evaluate.isPending}>
            {uri ? <Send /> : <SpeakingFilled />}
          </IconComponent>
        )}
      </View>
      {!status?.isRecording && uri && (
        <IconComponent onPress={handlePlaySound} disabled={evaluate.isPending}>
          {soundType === SpeakingSoundType.ANSWER ? (
            <Pause color={Styles.color.orange[700].color} fill={Styles.color.orange[700].color} size={24} />
          ) : (
            <Play color={Styles.color.orange[700].color} fill={Styles.color.orange[700].color} size={24} />
          )}
        </IconComponent>
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
    paddingVertical: bottomButtonToScreen,
    position: 'relative',
  },
  textRecording: {
    ...Styles.color.neutral[300],
    ...Styles.font.bold,
    ...Styles.fontSize.body,
  },
  rive: {
    width: 300,
    zIndex: -1,
    bottom: 0,
    top: 0,
    position: 'absolute',
    opacity: 0.3,
  },
});
