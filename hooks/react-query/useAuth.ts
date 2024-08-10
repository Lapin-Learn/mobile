import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { forgotPassword, resetPassword, signIn, signUp, verify, signOut } from '~/services/auth';

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data, variables) => router.push(`/auth/(sign-up)/verify?email=${variables.email}`),
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
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
    onSuccess: (data, variables) => {
      router.dismissAll();
      router.push(`auth/reset-password?email=${variables.email}`);
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
