import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import TrackPlayer, { AppKilledPlaybackBehavior, State } from 'react-native-track-player';

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      alwaysPauseOnInterruption: true,
    },
  });
};

export async function useSetupTrackPlayer({ onLoad }: { onLoad?: () => void }) {
  // registerBackgroundService();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      (async () => {
        await setupPlayer();
        isInitialized.current = true;

        if (onLoad) {
          onLoad();
        }
      })();
    }

    // AppState logic to pause playback when backgrounded
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        const state = await TrackPlayer.getState();
        if (state === State.Playing) {
          await TrackPlayer.pause(); // Pause the player when the app goes to the background
        }
      }
    };

    // Add the listener for AppState changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup on unmount
    return () => {
      subscription.remove();
      TrackPlayer.pause();
    };
  }, [onLoad]);
}
