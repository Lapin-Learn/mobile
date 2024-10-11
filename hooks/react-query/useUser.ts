import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { IUserProfile } from '~/lib/interfaces';
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
  const accountIdentifier = useQuery({
    queryKey: ['accountIdentifier'],
    queryFn: getAccountIdentifier,
    staleTime: Infinity,
  });

  if (accountIdentifier.error?.message === 'Unauthorized') {
    signOut.mutate();
  }

  const { data: account, isSuccess } = accountIdentifier;

  if (
    accountIdentifier.error?.message === 'User not found' ||
    (isSuccess && (!account.dob || !account.fullName || !account.gender))
  ) {
    router.replace('/update-profile');
  }

  return accountIdentifier;
};
export const useUserProfile = () => {
  const signOut = useSignOut();
  const userProfile = useQuery({
    queryKey: ['userProfile'],
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
      queryClient.setQueryData(['userProfile'], returnData);
      queryClient.setQueryData(['accountIdentifier'], returnData);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
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
  const signOut = useSignOut();
  const gameProfile = useQuery({
    queryKey: ['gameProfile'],
    queryFn: getGameProfile,
    staleTime: 0,
  });

  if (gameProfile.error?.message === 'Unauthorized') {
    signOut.mutate();
  }

  return gameProfile;
};
