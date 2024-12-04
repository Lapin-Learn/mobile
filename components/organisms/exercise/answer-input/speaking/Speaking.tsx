import { Audio, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import Volumn from '~/assets/images/volumn.svg';
import { RecordBar } from '~/components/organisms/exercise/answer-input/speaking/RecordingBar';
import Styles from '~/constants/GlobalStyles';
import { Answer, SpeakingSoundType, useSpeakingStore } from '~/hooks/zustand';
import { configureAudioSession } from '~/lib/config';
import { IQuestion } from '~/lib/types/questions';
import { getAccurateIPA } from '~/lib/utils';

type SpeakingProps = {
  data?: IQuestion;
  onAnswer: (answer: Answer) => void;
};

const Speaking = ({ data, onAnswer, ...props }: SpeakingProps) => {
  const navigation = useNavigation();

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
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
          }}>
          <View style={{ width: 30, height: 30, margin: 1.5 }}>
            <Volumn color={Styles.color.blue[500].color} onPress={() => setSoundType(SpeakingSoundType.QUESTION)} />
          </View>

          <View
            style={{
              flexShrink: 1,
            }}>
            <TranscriptDisplay question={data?.content.question ?? ''} />
          </View>
        </View>
      </View>
      <RecordBar question={data?.content.question ?? ''} />
    </View>
  );
};

const TranscriptDisplay = ({ question }: { question: string }) => {
  const { result } = useSpeakingStore();
  if (!result)
    return (
      <View
        style={{
          flexShrink: 1,
        }}>
        <Text
          style={{
            ...Styles.font.semibold,
            ...Styles.fontSize['title-2'],
            ...Styles.color.dark,
          }}>
          {question}
        </Text>
      </View>
    );

  const getColorForValue = (value: number) => {
    if (value === 2) return 'green';
    if (value === 1) return 'orange';
    return 'red';
  };

  const renderTextWithColors = (text: string, correctLetters: number[], additionalStyles?: object) => {
    const words = text.split(' ');

    return words.map((word, index) => {
      const color = getColorForValue(correctLetters[index]);

      return (
        <Text key={index} style={{ color, ...additionalStyles }}>
          {word}
          <Text> </Text>
        </Text>
      );
    });
  };

  return (
    <>
      <Text
        style={{
          ...Styles.font.semibold,
          ...Styles.fontSize['title-2'],
          ...Styles.color.dark,
        }}>
        {renderTextWithColors(result.original_transcript, result.correct_letters)}
      </Text>

      <Text
        style={{
          ...Styles.font.normal,
          ...Styles.fontSize['title-2'],
        }}>
        {renderTextWithColors(result.original_ipa_transcript, result.correct_letters)}
      </Text>
    </>
  );
};

export default Speaking;
