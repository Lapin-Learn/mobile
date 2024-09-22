import { useEffect, useRef } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    stoppingAppPausesPlayback: true, // This is for android only
    android: {
      alwaysPauseOnInterruption: true,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });
};

export async function useSetupTrackPlayer({ onLoad }: { onLoad?: () => void }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    !isInitialized.current &&
      setupPlayer()
        .then(() => {
          isInitialized.current = true;
          onLoad?.();
        })
        .catch((error) => {
          isInitialized.current = false;
          console.error(error);
        });
  }, [onLoad]);
}
