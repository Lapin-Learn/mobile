import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useRefreshToken } from '~/hooks/react-query/useAuth';
import { useAuth } from '~/hooks/zustand';
import { crashlytics } from '~/lib/services';
import { getTokenAsync } from '~/services/utils/utils';

export const AppStateHandler = () => {
  const appState = useRef(AppState.currentState);
  const queryClient = useQueryClient();
  const refreshTokenMutation = useRefreshToken();
  const { status } = useAuth();

  useEffect(() => {
    const handleAppActive = async () => {
      try {
        if (status === 'signIn') {
          const token = await getTokenAsync();
          if (token?.refreshToken) {
            await refreshTokenMutation.mutateAsync(token.refreshToken);
          }
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['questionTypes'] }),
          queryClient.invalidateQueries({ queryKey: ['lessons'] }),
          queryClient.invalidateQueries({ queryKey: ['user'] }),
        ]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        crashlytics.recordError({
          name: 'AppStateHandler Error',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : new Error(errorMessage).stack,
        });
      }
    };

    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      const isComingToForeground = appState.current.match(/inactive|background/) && nextAppState === 'active';

      if (isComingToForeground) {
        await handleAppActive();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [queryClient, refreshTokenMutation, status]);

  return null;
};
