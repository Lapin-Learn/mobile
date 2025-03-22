import { Audio, AVPlaybackStatus } from 'expo-av';
import { PauseIcon, PlayIcon, RotateCcw } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { configureAudioSession } from '~/lib/config';
import { formatAudioTimer } from '~/lib/utils';

import { ProgressProps, SeekBar } from './SeekBar';

enum PlaybackState {
  Playing = 'Playing',
  Paused = 'Paused',
}

type TrackAudioProps = {
  url?: string;
  checked?: boolean;
};

export const TrackAudio = ({ url, checked }: TrackAudioProps) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(PlaybackState.Paused);
  const [sound, setSound] = useState<Audio.Sound>();
  const [progress, setProgress] = useState<ProgressProps>({ position: 0, duration: 0 });
  const isMounted = useRef(true);

  const initializeAudio = useCallback(async () => {
    if (!url || checked) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      if (isMounted.current) {
        setSound(newSound);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, [url, checked]);

  useEffect(() => {
    configureAudioSession();
    initializeAudio();

    return () => {
      isMounted.current = false;
      sound?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (checked) {
      sound?.unloadAsync();
      setPlaybackState(PlaybackState.Paused);
    } else {
      initializeAudio();
    }
  }, [checked, initializeAudio]);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setProgress({
      position: status.positionMillis / 1000,
      duration: status.durationMillis ? status.durationMillis / 1000 : 0,
    });

    if (status.didJustFinish) {
      setPlaybackState(PlaybackState.Paused);
    }
  }, []);

  const handlePlayPause = useCallback(async () => {
    if (!sound) return;

    try {
      if (playbackState === PlaybackState.Playing) {
        await sound.pauseAsync();
        setPlaybackState(PlaybackState.Paused);
      } else {
        await sound.playAsync();
        setPlaybackState(PlaybackState.Playing);
      }
    } catch (error) {
      console.error('Error handling play/pause:', error);
    }
  }, [sound, playbackState]);

  const handleRestart = useCallback(async () => {
    if (!sound) return;

    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
      setPlaybackState(PlaybackState.Playing);
    } catch (error) {
      console.error('Error handling restart:', error);
    }
  }, [sound]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(playbackState === PlaybackState.Playing ? 1.1 : 1, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
  }));

  const PlaybackIcon = playbackState === PlaybackState.Playing ? PauseIcon : PlayIcon;

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <Animated.View style={buttonStyle}>
          <TouchableOpacity onPress={handlePlayPause}>
            <PlaybackIcon color={Styles.color.orange[700].color} size={20} fill={Styles.color.orange[700].color} />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity onPress={handleRestart}>
          <RotateCcw color={Styles.color.orange[700].color} size={20} />
        </TouchableOpacity>
      </View>
      <SeekBar progress={progress} sound={sound} />
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {progress.position >= 0 && formatAudioTimer(progress.duration - progress.position)}
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
    columnGap: 8,
    borderRadius: 10,
    borderWidth: 1,
    ...Styles.borderColor.border,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  controls: {
    flexDirection: 'row',
    columnGap: 4,
    paddingHorizontal: 4,
  },
  timeContainer: {
    width: 56,
  },
  time: {
    ...Styles.fontSize.subhead,
    ...Styles.font.medium,
    ...Styles.color.neutral[600],
    textAlign: 'center',
  },
});
