import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { PauseIcon, PlayIcon, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { configureAudioSession } from '~/lib/config';
import { formatAudioTimer } from '~/lib/utils';

import { ProgressProps, SeekBar } from './SeekBar';

enum State {
  None = 'None',
  Playing = 'Playing',
  Paused = 'Paused',
  Repeat = 'Repeat',
}

type TrackAudioProps = {
  url?: string;
  checked?: boolean;
};

export const TrackAudio = ({ url, checked }: TrackAudioProps) => {
  const [currentState, setCurrentState] = useState<State>(State.None);
  const [playerState, setPlayerState] = useState<AVPlaybackStatusSuccess>();
  const [sound, setSound] = useState<Audio.Sound>();
  const [progress, setProgress] = useState<ProgressProps>({ position: 0, duration: 0 });

  useEffect(() => {
    configureAudioSession();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (checked) {
      setCurrentState(State.Paused);
      if (sound) {
        sound.unloadAsync();
      }
    } else {
      setCurrentState(State.None);
    }
  }, [checked]);

  useEffect(() => {
    const playSound = async (url: string) => {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true }, _onPlaybackStatusUpdate);
        setSound(sound);
        setCurrentState(State.Playing);
      } catch (error) {
        console.error(error);
      }
    };

    if (!checked) {
      if (url && currentState === State.None) {
        playSound(url);
      }

      sound?.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
    }
    sound?.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, currentState]);

  const _onPlaybackStatusUpdate = async (playbackStatus: AVPlaybackStatus) => {
    try {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          console.error(`Encountered a fatal error during playback: ${playbackStatus.error}`);
        }
      } else {
        setPlayerState(playbackStatus);
        setProgress({
          position: playbackStatus.positionMillis / 1000,
          duration: (playbackStatus.durationMillis ?? 0) / 1000,
        });
        if (playbackStatus.isPlaying) {
          if (currentState !== State.Playing) {
            await sound?.pauseAsync();
          }
        } else {
          switch (currentState) {
            case State.Playing:
              if (playbackStatus.durationMillis === playbackStatus.positionMillis) {
                await sound?.stopAsync();
              }
              await sound?.playAsync();
              break;
            case State.Paused:
              await sound?.pauseAsync();
              break;
            case State.Repeat:
              await sound?.stopAsync();
              await sound?.playAsync();
              setCurrentState(State.Playing);
              break;
            default:
              break;
          }
        }
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          setCurrentState(State.None);
          await sound?.pauseAsync();
        }
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const Action = ({ repeat }: { repeat?: boolean }) => {
    const Component = repeat ? RotateCcw : currentState === State.Playing ? PauseIcon : PlayIcon;
    return (
      <TouchableOpacity
        onPress={() =>
          setCurrentState(repeat ? State.Repeat : currentState === State.Playing ? State.Paused : State.Playing)
        }>
        <Component style={{ height: 24, width: 24 }} color='black' />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <View style={{ display: 'flex', flexDirection: 'row', columnGap: 4 }}>
        <Action />
        <Action repeat />
      </View>
      <SeekBar progress={progress} sound={sound ?? undefined} />
      <View style={{ width: 56 }}>
        <Text style={styles.time}>
          {playerState &&
            playerState?.durationMillis &&
            playerState?.positionMillis &&
            formatAudioTimer(progress.duration - progress.position)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 16,
    borderRadius: 12,
    borderWidth: 1,
    ...Styles.borderColor.neutral[200],
    padding: 16,
  },
  time: {
    ...Styles.fontSize.body,
    ...Styles.font.semibold,
    textAlign: 'center',
  },
});
