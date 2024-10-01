import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import TrackPlayer, { AppKilledPlaybackBehavior, State } from 'react-native-track-player';

let isPlayerInitialized = false;

const setupPlayer = async () => {
  if (!isPlayerInitialized) {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        alwaysPauseOnInterruption: true,
      },
    });
    isPlayerInitialized = true;
  }
};

export function useSetupTrackPlayer({ onLoad }: { onLoad?: () => void }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      (async () => {
        try {
          await setupPlayer();
          isInitialized.current = true;

          if (onLoad) {
            onLoad();
          }
        } catch (error) {
          console.error('Error setting up TrackPlayer:', error);
        }
      })();
    }

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        const state = await TrackPlayer.getState();
        if (state === State.Playing) {
          await TrackPlayer.pause();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      TrackPlayer.pause();
    };
  }, [onLoad]);
}
