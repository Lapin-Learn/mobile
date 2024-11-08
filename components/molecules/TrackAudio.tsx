import { useNavigation } from 'expo-router';
import { PauseIcon, PlayIcon, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import TrackPlayer, { Event, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { formatAudioTimer } from '~/lib/utils';

import { SeekBar } from './SeekBar';

const events = [Event.PlaybackState, Event.PlaybackError];

type TrackAudioProps = {
  data: {
    id: string;
    url: string;
  };
  checked?: boolean;
};

export const TrackAudio = ({ data, checked }: TrackAudioProps) => {
  const navigation = useNavigation();
  const [playerState, setPlayerState] = useState<State>(State.None);
  const { position, duration } = useProgress();

  useEffect(() => {
    const setupTrack = async () => {
      if (Platform.OS === 'ios') {
        await TrackPlayer.reset();
      } else {
        const queueItems = await TrackPlayer.getQueue();
        for (let i = 0; i < queueItems.length; i++) {
          await TrackPlayer.remove(0);
        }
        await TrackPlayer.removeUpcomingTracks();
        await TrackPlayer.pause();
      }

      await TrackPlayer.add(data)
        .then(async () => {
          if (Platform.OS === 'android') {
            await TrackPlayer.skipToNext();
          }
          await TrackPlayer.play();
        })
        .catch((err) => {
          console.error('err', err);
        });
    };

    if (!checked) {
      setupTrack();
    }

    if (checked) {
      TrackPlayer.pause();
    }
  }, [data, checked]);

  useEffect(() => {
    return () => {
      navigation.addListener('beforeRemove', () => {
        TrackPlayer.pause();
        if (Platform.OS === 'ios') {
          TrackPlayer.reset();
        } else {
          TrackPlayer.removeUpcomingTracks();
        }
      });
    };
  });

  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
      if (event.state === State.Ended) {
        TrackPlayer.seekTo(100);
        TrackPlayer.pause();
      }
    }
  });

  const handleAction = (action: string) => () => {
    switch (action) {
      case 'play':
        if (playerState === State.Ready) {
          TrackPlayer.seekTo(0);
          return TrackPlayer.play();
        }
        if (playerState === State.Playing) {
          return TrackPlayer.pause();
        }
        return TrackPlayer.play();
      case 'repeat':
        TrackPlayer.seekTo(0);
        return TrackPlayer.play();
      default:
        return TrackPlayer.pause();
    }
  };

  const Action = ({ repeat }: { repeat?: boolean }) => {
    const Component = repeat ? RotateCcw : playerState === State.Playing ? PauseIcon : PlayIcon;
    return (
      <TouchableOpacity onPress={handleAction(repeat ? 'repeat' : playerState === State.Playing ? 'pause' : 'play')}>
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
      <SeekBar progress={useProgress(500)} />
      <View style={{ width: 56 }}>
        <Text style={styles.time}>{formatAudioTimer(duration - position)}</Text>
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
