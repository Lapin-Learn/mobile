import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import useStreakWidget from '~/hooks/useStreakWidget';
import { QUERY_KEYS } from '~/lib/constants';
import { IAccountIdentifer, IPresignedUrl, IUserProfile } from '~/lib/types';
import {
  changePassword,
  createPresignedUrl,
  createUpdatePresignedUrl,
  deleteAccount,
  getAccountIdentifier,
  getGameProfile,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from '~/services';

import { useToast } from '../useToast';
import { useSignOut } from './useAuth';

export const useAccountIdentifier = () => {
  const accountIdentifier = useQuery({
    queryKey: [QUERY_KEYS.profile.identifier],
    queryFn: getAccountIdentifier,
    staleTime: Infinity,
    retry: false,
  });

  return accountIdentifier;
};

export const useUserProfile = () => {
  const toast = useToast();
  const signOut = useSignOut();
  const { t } = useTranslation();
  const userProfile = useQuery({
    queryKey: [QUERY_KEYS.profile.user],
    queryFn: getUserProfile,
    staleTime: Infinity,
  });
  if (userProfile.error?.message === 'Unauthorized') {
    toast.show({
      type: 'error',
      text1: t('profile:profile.unauthorized'),
      text2: t('profile:profile.unauthorized_response'),
    });
    signOut.mutate();
  }

  return userProfile;
};

export const useGetUserAvatar = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.profile.user, 'avatar'],
    queryFn: async () => {
      const data = await getUserProfile();
      return data.avatar;
    },
    staleTime: Infinity,
  });
};

export const useUpdateUserProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (returnData: IUserProfile) => {
      toast.show({ type: 'success', text1: t('profile:profile.updated') });
      queryClient.setQueryData([QUERY_KEYS.profile.identifier], returnData);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile.user] });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useCreatePresignedUrl = () => {
  return useMutation({
    mutationFn: createPresignedUrl,
  });
};

export const useUploadAvatar = () => {
  const createPresignedUrl = useCreatePresignedUrl();
  const createUpdatePresignedUrl = useCreateUpdatePresignedUrl();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, filename, avatarId }: { file: ArrayBuffer; avatarId?: string; filename?: string }) => {
      let presignedUrl: IPresignedUrl = { id: '', url: '' };
      if (!avatarId) {
        presignedUrl = await createPresignedUrl.mutateAsync({ name: filename || 'test.jpg' });
        await uploadAvatar({ presignedUrl, file });
        return updateUserProfile({ avatarId: presignedUrl.id });
      } else {
        presignedUrl = await createUpdatePresignedUrl.mutateAsync({
          name: filename ?? 'avatar.jpg',
          uuid: avatarId,
        });
        return uploadAvatar({ presignedUrl, file });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile.user, 'avatar'] });
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};

export const useCreateUpdatePresignedUrl = () => {
  return useMutation({
    mutationFn: createUpdatePresignedUrl,
  });
};

export const useChangePassword = () => {
  const toast = useToast();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.show({ type: 'success', text1: t('profile:profile.password_changed') });
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

export const useDeleteAccount = () => {
  const { t } = useTranslation();
  const signOut = useSignOut();
  const toast = useToast();
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData<IAccountIdentifer>([QUERY_KEYS.profile.identifier]);
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.show({
        type: 'success',
        text1: t('profile:profile.deleted'),
        text2: t('profile:profile.deleted_response', { email: cachedData?.email }),
      });
      signOut.mutate();
    },
    onError: (error) => {
      toast.show({ type: 'error', text1: error.message });
    },
  });
};
