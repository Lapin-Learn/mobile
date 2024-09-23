import { PauseIcon, PlayIcon, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import TrackPlayer, { Event, RepeatMode, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

import { Text } from '~/components/ui/Text';
import { formatAudioTimer } from '~/lib/utils';

import { SeekBar } from './SeekBar';

const events = [Event.PlaybackState, Event.PlaybackError];

const data = {
  id: 'trackId',
  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  title: 'Track Title',
  artist: 'Track Artist',
};

export function TrackAudio() {
  const [playerState, setPlayerState] = useState<State>(State.None);
  const { position, duration } = useProgress();

  useEffect(() => {
    TrackPlayer.add(data)
      .then(() => {
        TrackPlayer.play();
      })
      .catch((err) => {
        console.error('err', err);
      });
    TrackPlayer.setRepeatMode(RepeatMode.Off);
  }, []);

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

  // TODO: Implement remove track if needed when question is answered
  const handleRemove = async () => {
    await TrackPlayer.remove([parseInt(data.id as string)]);
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
