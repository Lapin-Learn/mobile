import TrackPlayer, { Capability } from 'react-native-track-player';

export async function TrackPlayerSetup() {
  try {
    await TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
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
    });
  } catch (error) {
    console.error('Error setting up TrackPlayer:', error);
  }
}
