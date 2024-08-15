import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { signIn as setNewToken } from '~/hooks/zustand';
import { setTokenAsync } from '~/services';
import { forgotPassword, resetPassword, signIn, signOut, signUp, verify } from '~/services/auth';

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => router.back(),
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      setNewToken(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, variables) => router.push(`/auth/verify?email=${variables.email}`),
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useVerifySignUp = () => {
  return useMutation({
    mutationFn: verify,
    onSuccess: () => {
      router.dismissAll();
      router.navigate('auth/sign-in');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useVerifyForgotPassword = () => {
  return useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      router.dismissAll();
      setTokenAsync(data);
      router.push(`auth/reset-password`);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => router.navigate('auth/sign-in'),
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useSignOut = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      signOut();
      client.clear();
      router.navigate('auth/sign-in');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
