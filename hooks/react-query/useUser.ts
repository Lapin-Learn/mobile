import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import {
  changePassword,
  createPreSignedUrl,
  createUpdatePreSignedUrl,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from '~/services';

import { useToast } from '../useToast';
import { useSignOut } from './useAuth';

export const useUserProfile = () => {
  const signOut = useSignOut();
  const userProfile = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });
  if (userProfile.error?.message === 'Unauthorized') {
    signOut.mutate();
  }

  // TODO: update user profile
  // if (userProfile.error?.message === 'User not found' || userProfile.data?.fullName === null) {
  //   router.replace('/update-profile');
  // }

  return userProfile;
};

export const useUpdateUserProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.show({ type: 'success', text1: 'Profile updated' });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      router.push('/profile');
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
