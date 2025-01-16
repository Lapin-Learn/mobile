import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AUTH_ERRORS, QUERY_KEYS } from '~/lib/constants';
import { analytics, crashlytics } from '~/lib/services';
import { setTokenAsync } from '~/services';
import {
  createProfile,
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
import { useAuthScreen } from '../zustand/useAuthScreenStore';

export const useSignUp = () => {
  const { t } = useTranslation('auth');
  const toast = useToast();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (_, variables) => {
      toast.show({ type: 'success', text1: t('signUp.success') });
      router.push(`/auth/(sign-up)/verify?email=${variables.email}`);
      analytics.logSignUp({
        method: 'email',
      });
    },
    onError: (error) => {
      const errMes = AUTH_ERRORS[error.message];
      toast.show({ type: 'error', text1: errMes ? t(`error.${errMes}`) : t('error.undefined') });
    },
  });
};

export const useSignIn = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation('auth');
  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data, variables) => {
      if (data === null) {
        router.push(`/auth/(sign-up)/verify?email=${variables.email}`);
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.profile.identifier],
        });
        await setTokenAsync(data);
        analytics.logLogin({
          method: 'email',
        });
        crashlytics.setUserId(data.accessToken);
        crashlytics.setAttributes({
          method: 'email',
          role: 'user',
          email: variables.email,
          describe: 'sign in',
        });
        toast.show({ type: 'success', text1: t('signIn.welcomeBack') });
        router.replace('/');
      }
    },
    onError: (error) => {
      const errMes = AUTH_ERRORS[error.message];
      toast.show({ type: 'error', text1: errMes ? t(`error.${errMes}`) : t('error.undefined') });
    },
  });
};

export const useSignInWithProvider = () => {
  const toast = useToast();
  const { t } = useTranslation('auth');
  return useMutation({
    mutationFn: signInWithProvider,
    onSuccess: async (data) => {
      if (data) {
        analytics.logLogin({
          method: 'google',
        });
        toast.show({ type: 'success', text1: t('signIn.welcomeBack') });
        await setTokenAsync(data);
        router.replace('/');
      }
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
      crashlytics.recordError(error);
    },
  });
};

export const useForgotPassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, variables) => router.push(`/auth/(forgot-password)/verify?email=${variables.email}`),
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useResendVerify = () => {
  const toast = useToast();
  const { t } = useTranslation('auth');
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => toast.show({ type: 'success', text1: t('verify.success') }),
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useVerifySignUp = () => {
  const toast = useToast();
  const createProfile = useCreateProfile();
  return useMutation({
    mutationFn: verify,
    onSuccess: async (data) => {
      createProfile.mutate(data.accessToken);
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
  const { t } = useTranslation('auth');
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.show({ type: 'success', text1: t('resetPassword.success') });
      router.navigate('/auth/sign-in' as Href);
    },
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
      updateStreak.sendStreakToSharedStorage('...');
      client.clear();
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
      crashlytics.recordError(error);
    },
  });
};

export const useCreateProfile = () => {
  const toast = useToast();
  const { postScreen } = useAuthScreen();
  return useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      if (postScreen === 'sign-in') {
        router.back();
      } else {
        router.dismissAll();
        router.navigate('/auth/sign-in' as Href);
      }
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};
