import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

import useStreakWidget from '~/hooks/useStreakWidget';
import { QUERY_KEYS } from '~/lib/constants';
import { IUserProfile } from '~/lib/types';
import {
  changePassword,
  createPreSignedUrl,
  createUpdatePreSignedUrl,
  getAccountIdentifier,
  getGameProfile,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from '~/services';

import { useToast } from '../useToast';
import { useSignOut } from './useAuth';

export const useAccountIdentifier = () => {
  const signOut = useSignOut();
  const queryClient = useQueryClient();
  const accountIdentifier = useQuery({
    queryKey: [QUERY_KEYS.profile.identifier],
    queryFn: getAccountIdentifier,
    staleTime: Infinity,
  });
  const pathname = usePathname();
  const router = useRouter();
  const { data: account, isSuccess } = accountIdentifier;
  if (pathname.startsWith('/auth') || pathname === '/on-boarding') {
    if (account) {
      if (!account.dob || !account.fullName || !account.gender) router.replace('/update-profile');
      else router.replace('/');
    }
    return;
  }

  if (accountIdentifier.error?.message === 'Unauthorized') {
    queryClient.setQueryData([QUERY_KEYS.profile.identifier], null);
    signOut.mutate();
  }

  useEffect(() => {
    if (
      accountIdentifier.error?.message === 'User not found' ||
      (isSuccess && (!account.dob || !account.fullName || !account.gender))
    ) {
      router.replace('/update-profile');
    }
  }, [accountIdentifier.error, isSuccess, account, router]);

  return accountIdentifier;
};
export const useUserProfile = () => {
  const signOut = useSignOut();
  const userProfile = useQuery({
    queryKey: [QUERY_KEYS.profile.user],
    queryFn: getUserProfile,
    staleTime: Infinity,
  });
  if (userProfile.error?.message === 'Unauthorized') {
    signOut.mutate();
  }

  return userProfile;
};

export const useUpdateUserProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (returnData: IUserProfile) => {
      toast.show({ type: 'success', text1: 'Profile updated' });
      queryClient.setQueryData([QUERY_KEYS.profile.identifier], returnData);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile.user] });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useCreatePreSignedUrl = () => {
  return useMutation({
    mutationFn: createPreSignedUrl,
  });
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: uploadAvatar,
  });
};

export const useCreateUpdatePreSignedUrl = () => {
  return useMutation({
    mutationFn: createUpdatePreSignedUrl,
  });
};

export const useChangePassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.show({ type: 'success', text1: 'Password changed' });
      router.back();
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useGameProfile = () => {
  const updateStreak = useStreakWidget();
  const gameProfile = useQuery({
    queryKey: [QUERY_KEYS.profile.game],
    queryFn: getGameProfile,
    staleTime: 0,
  });

  updateStreak.sendStreakToSharedStorage(gameProfile.data?.streak.current.toString() || '...');

  return gameProfile;
};
