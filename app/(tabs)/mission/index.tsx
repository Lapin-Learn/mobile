import { Text } from 'react-native';

import PlatformView from '~/components/molecules/PlatformView';
import { TrackAudio } from '~/components/molecules/TrackAudio';

export default function Mission() {
  return (
    <PlatformView>
      <Text>Mission</Text>
      <TrackAudio />
    </PlatformView>
  );
}
