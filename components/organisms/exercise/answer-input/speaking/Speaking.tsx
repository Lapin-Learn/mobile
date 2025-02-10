import { Audio, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RiveSound } from '~/components/molecules/rive/Sound';
import { RecordBar } from '~/components/organisms/exercise/answer-input/speaking/RecordingBar';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useSpeakingEvaluation } from '~/hooks/react-query/useDailyLesson';
import { Answer, SpeakingSoundType, useSpeakingStore } from '~/hooks/zustand';
import { configureAudioSession } from '~/lib/config';
import { IQuestion } from '~/lib/types/questions';
import { getAccurateIPA } from '~/lib/utils';

import { getColorForValue } from './helpers';

type SpeakingProps = {
  data?: IQuestion;
  onAnswer: (answer: Answer) => void;
};

const Speaking = ({ data, onAnswer }: SpeakingProps) => {
  const navigation = useNavigation();
  const evaluate = useSpeakingEvaluation();

  const { uri, soundType, result, setSoundType, initState } = useSpeakingStore();
  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    configureAudioSession();
  }, []);

  useEffect(() => {
    let parent = navigation.getParent();
    while (parent) {
      parent.setOptions({ gestureEnabled: false });
      parent = parent.getParent();
    }
  }, [navigation]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [initState, sound]);

  useEffect(() => {
    const playSound = async (url: string) => {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true }, _onPlaybackStatusUpdate);
        setSound(sound);

        await sound.playAsync();
      } catch (error) {
        console.error(error);
      }
    };

    switch (soundType) {
      case SpeakingSoundType.QUESTION:
        playSound(data?.audio?.url ?? '');
        break;
      case SpeakingSoundType.ANSWER:
        playSound(uri!);
        break;
      case SpeakingSoundType.SEND:
        if (result) {
          const { accCorrectLetters, accIncorrectLetters } = getAccurateIPA(result.correct_letters);
          onAnswer({
            numberOfCorrect: accCorrectLetters / (accCorrectLetters + accIncorrectLetters) > 0.5 ? 1 : 0,
            totalOfQuestions: 1,
          });
        }
        initState();
        break;
      default:
        break;
    }
    sound?.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundType]);

  const _onPlaybackStatusUpdate = async (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        console.error(`Encountered a fatal error during playback: ${playbackStatus.error}`);
      }
    } else {
      if (playbackStatus.isPlaying) {
        if (soundType === SpeakingSoundType.IDLE) {
          await sound?.pauseAsync();
        }
      }
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        setSoundType(SpeakingSoundType.IDLE);
        await sound?.unloadAsync();
      }
    }
  };

  return (
    <View style={{ height: '100%' }}>
      <View style={{ flexGrow: 1, justifyContent: 'center', padding: 32 }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
          }}>
          {data?.audio?.url && (
            <View style={{ width: 60, height: 60, margin: 4 }}>
              <Button
                onPress={() => setSoundType(SpeakingSoundType.QUESTION)}
                size='icon'
                style={{
                  backgroundColor: '#00000000',
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  height: '100%',
                  width: '100%',
                }}>
                <RiveSound isPlaying={soundType === SpeakingSoundType.QUESTION} />
                <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#FFFFFF00' }} />
              </Button>
            </View>
          )}

          <View
            style={{
              flexShrink: 1,
            }}>
            <TranscriptDisplay question={data?.content.question ?? ''} />
          </View>
        </View>
      </View>
      <RecordBar question={data?.content.question ?? ''} evaluate={evaluate} />
    </View>
  );
};

const TranscriptDisplay = ({ question }: { question: string }) => {
  const { result } = useSpeakingStore();
  if (!result)
    return (
      <Text
        style={[
          styles.rootText,
          {
            ...Styles.color.dark,
          },
        ]}>
        {question}
      </Text>
    );

  const renderTextWithColors = (text: string, correctLetters: number[]) => {
    const words = text.split(' ');

    return words.map((word, index) => (
      <Text key={index} style={{ color: getColorForValue(correctLetters[index]) }}>
        {word}&nbsp;
      </Text>
    ));
  };

  return (
    <>
      <Text
        style={[
          styles.rootText,
          {
            ...Styles.color.dark,
          },
        ]}>
        {renderTextWithColors(result.original_transcript, result.correct_letters)}
      </Text>
      <Text
        style={[
          styles.rootText,
          {
            opacity: 0.5,
          },
        ]}>
        {renderTextWithColors(result.original_ipa_transcript, result.correct_letters)}
      </Text>
    </>
  );
};

export default Speaking;

const styles = StyleSheet.create({
  rootText: {
    ...Styles.font.medium,
    ...Styles.fontSize['title-3'],
    textAlign: 'center',
  },
});
