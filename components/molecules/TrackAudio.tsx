import { PauseIcon, PlayIcon, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import TrackPlayer, { Event, RepeatMode, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

import { Text } from '~/components/ui/Text';
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

export function TrackAudio({ data, checked }: TrackAudioProps) {
  const [playerState, setPlayerState] = useState<State>(State.None);
  const { position, duration } = useProgress();

  useEffect(() => {
    const setupTrack = async () => {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add(data);
        await TrackPlayer.play();
        await TrackPlayer.setRepeatMode(RepeatMode.Off);
      } catch (error) {
        console.error('Error playing the track: ', error);
      }
    };

    if (!checked) {
      return async () => {
        await setupTrack();
      };
    }

    return () => {
      TrackPlayer.stop();
    };
  }, [data, checked]);

  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
  });

  const handleAction = (action: string) => () => {
    switch (action) {
      case 'play':
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
        <Component className='w-4 h-4' color='black' />
      </TouchableOpacity>
    );
  };

  return (
    <View className='w-full flex flex-row border border-black rounded-md justify-center items-center p-4 gap-x-4'>
      <View className='flex-row gap-x-2'>
        <Action />
        <Action repeat />
      </View>
      <SeekBar progress={useProgress(500)} />
      <Text className='font-semibold text-body'>{formatAudioTimer(duration - position)}</Text>
    </View>
  );
}
