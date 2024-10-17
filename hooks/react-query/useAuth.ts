import auth from '@react-native-firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';

import { signIn as setNewToken, signOut } from '~/hooks/zustand';
import { setTokenAsync } from '~/services';
import {
  forgotPassword,
  refreshToken,
  resetPassword,
  signIn,
  signInWithProvider,
  signUp,
  verify,
} from '~/services/axios/auth';

import { useToast } from '../useToast';

export const useSignUp = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.show({ type: 'success', text1: 'Sign up success' });
      router.push('/auth/sign-in');
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useSignIn = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast.show({ type: 'success', text1: 'Welcome back' });
      setNewToken(data);
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useSignInWithProvider = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: signInWithProvider,
    onSuccess: async (data) => {
      if (data) {
        await auth().signInWithCredential(data.credential);
        setNewToken(data.authInfo);
        toast.show({ type: 'success', text1: 'Welcome back' });
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
      router.navigate('auth/sign-in' as Href);
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
    onSuccess: () => router.navigate('auth/sign-in' as Href),
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useSignOut = () => {
  const toast = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      signOut();
      client.clear();
      router.replace('auth/sign-in' as Href);
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useRefreshToken = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => {
      toast.show({ type: 'success', text1: 'Token refreshed' });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};
