import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AUTH_ERRORS, QUERY_KEYS } from '~/lib/constants';
import { analytics } from '~/lib/services';
import { setTokenAsync } from '~/services';
import {
  forgotPassword,
  refreshToken,
  resetPassword,
  signIn,
  signInWithProvider,
  signOut,
  signUp,
  verify,
} from '~/services/axios/auth';

import useStreakWidget from '../useStreakWidget';
import { useToast } from '../useToast';

export const useSignUp = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.show({ type: 'success', text1: 'Sign up success' });
      router.push('/auth/sign-in');
      analytics.logSignUp({
        method: 'email',
      });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useSignIn = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation('auth');
  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.profile.identifier],
      });
      await setTokenAsync(data);
      analytics.logLogin({
        method: 'email',
      });
      toast.show({ type: 'success', text1: t('signIn.welcomeBack') });
      router.push('/');
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: t(`error.${AUTH_ERRORS[error.message]}`) });
    },
  });
};

export const useSignInWithProvider = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: signInWithProvider,
    onSuccess: async (data) => {
      if (data) {
        analytics.logLogin({
          method: 'google',
        });
        toast.show({ type: 'success', text1: 'Welcome back' });
        await setTokenAsync(data);
        router.push('/');
      }
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useForgotPassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, variables) => router.push(`/auth/verify?email=${variables.email}`),
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useResendVerify = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => toast.show({ type: 'success', text1: 'Resend success' }),
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useVerifySignUp = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: verify,
    onSuccess: () => {
      router.dismissAll();
      router.navigate('/auth/sign-in' as Href);
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useVerifyForgotPassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      router.dismissAll();
      setTokenAsync(data);
      router.push(`auth/reset-password` as Href);
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useResetPassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => router.navigate('/auth/sign-in' as Href),
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useSignOut = () => {
  const toast = useToast();
  const client = useQueryClient();
  const updateStreak = useStreakWidget();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      client.clear();
      router.replace('/auth/sign-in');
      updateStreak.sendStreakToSharedStorage('...');
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useRefreshToken = () => {
  const { t } = useTranslation('auth');
  const toast = useToast();
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => {
      toast.show({ type: 'success', text1: t('signIn.welcomeBack') });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};
