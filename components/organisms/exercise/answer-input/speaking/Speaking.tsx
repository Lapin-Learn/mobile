import { Audio, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import Volumn from '~/assets/images/volumn.svg';
import { RecordBar } from '~/components/organisms/exercise/answer-input/speaking/RecordingBar';
import { default as PlatformView } from '~/components/templates/PlatformView';
import Styles from '~/constants/GlobalStyles';
import { SpeakingSoundType, useAudioStore } from '~/hooks/zustand/useAudioStore';
import { configureAudioSession } from '~/lib/config';
import { deleteUri } from '~/lib/utils/fileSystem';

const data = {
  id: '1',
  text: 'What is your name? What is your name? What is your name? What is your name? What is your name?',
  url: 'https://firebasestorage.googleapis.com/v0/b/lapin-learn.appspot.com/o/Recording.mp3?alt=media&token=4f1ef2a9-1665-4242-806f-57ce7730544f',
};

const Speaking = () => {
  const navigation = useNavigation();

  const { uri, soundType, setSoundType, initState } = useAudioStore();
  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    configureAudioSession();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [initState, sound]);

  useEffect(() => {
    return () => {
      navigation.addListener('beforeRemove', async () => {
        initState();
        deleteUri(uri!);
      });
    };
  });

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
        playSound(data.url);
        break;
      case SpeakingSoundType.ANSWER:
        playSound(uri!);
        break;
      default:
        break;
    }
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
    <PlatformView>
      <View style={{ flexGrow: 1, justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 32,
            gap: 12,
          }}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: soundType === SpeakingSoundType.QUESTION ? 1.3 : 1 }}
            transition={{
              type: 'timing',
              duration: 800,
              loop: true,
              repeatReverse: true,
            }}
            style={{ width: 30, height: 30, margin: 1.5 }}>
            <Volumn color={Styles.color.blue[500].color} onPress={() => setSoundType(SpeakingSoundType.QUESTION)} />
          </MotiView>
          <Text
            style={{
              ...Styles.font.semibold,
              ...Styles.fontSize['title-2'],
              ...Styles.color.dark,
            }}>
            {data.text}
          </Text>
        </View>
      </View>
      <RecordBar />
    </PlatformView>
  );
};

export default Speaking;
