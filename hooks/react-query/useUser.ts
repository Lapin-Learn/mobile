import { useMutation, useQuery } from '@tanstack/react-query';

import { getUserProfile, updateUserProfile } from '~/services';

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
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.show({ type: 'success', text1: 'Profile updated' });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};
