import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { User } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';
import { useGetUserAvatar, useUploadAvatar } from '~/hooks/react-query/useUser';
import { useToast } from '~/hooks/useToast';
import { crashlytics } from '~/lib/services';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const COMPRESSION_QUALITY = 0.7;

const Avatar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const { data: avatar, isFetching, isSuccess } = useGetUserAvatar();
  const { mutate: uploadAvatar } = useUploadAvatar();
  const toast = useToast();
  const { t } = useTranslation('error');

  const handleChangeAvatar = async () => {
    if (isChangingAvatar) return;
    setIsChangingAvatar(true);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show({
          type: 'error',
          text1: t('PERMISSION_DENIED.title'),
          text2: t('PERMISSION_DENIED.description'),
        });
        setIsChangingAvatar(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: COMPRESSION_QUALITY,
        base64: true,
      });

      if (result.canceled) {
        setIsChangingAvatar(false);
        return;
      }

      const base64String = result.assets[0].base64 || '';
      const byteLength =
        base64String.length * (3 / 4) - (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0);

      if (byteLength > MAX_FILE_SIZE) {
        toast.show({
          type: 'error',
          text1: t('EXCEED_MAX_FILE_SIZE.title'),
          text2: t('EXCEED_MAX_FILE_SIZE.description', {
            size: '3MB',
          }),
        });
        setIsChangingAvatar(false);
        return;
      }

      const arrBuffer = new Uint8Array(
        atob(base64String)
          .split('')
          .map((c) => c.charCodeAt(0))
      ).buffer;

      await uploadAvatar(
        {
          file: arrBuffer,
          avatarId: avatar?.id,
          filename: result.assets[0].fileName ?? 'avatar.jpg',
        },
        {
          onSuccess: () => {
            toast.show({
              type: 'success',
              text1: t('success.title', { ns: 'translation' }),
              text2: t('success.avatar_updated', { ns: 'translation' }),
            });
          },
          onError: (error) => {
            crashlytics.recordError({
              name: 'Avatar Upload Error',
              message: error instanceof Error ? error.message : 'Failed to upload avatar',
              stack: error instanceof Error ? error.stack : new Error().stack,
            });
            toast.show({
              type: 'error',
              text1: t('UPLOAD_FAILED.title'),
              text2: t('UPLOAD_FAILED.description'),
            });
          },
        }
      );
    } catch (error) {
      crashlytics.recordError({
        name: 'Avatar Change Error',
        message: error instanceof Error ? error.message : 'Failed to change avatar',
        stack: error instanceof Error ? error.stack : new Error().stack,
      });
      toast.show({
        type: 'error',
        text1: t('UNKNOWN_ERROR.title'),
        text2: t('UNKNOWN_ERROR.description'),
      });
    } finally {
      setIsChangingAvatar(false);
    }
  };

  return (
    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
      <TouchableOpacity
        style={styles.avatar}
        onPress={handleChangeAvatar}
        disabled={isLoading || isChangingAvatar || isFetching}>
        {isFetching && <Skeleton width='100%' height='100%' colorMode='light' />}

        {isSuccess && !avatar && !isChangingAvatar && !isFetching && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.absoluteFill, styles.placeholderContainer]}>
            <User size={48} color={Styles.color.neutral['300'].color} />
          </Animated.View>
        )}

        {avatar && !isFetching && !isChangingAvatar && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.absoluteFill}>
            <ExpoImage
              style={styles.absoluteFill}
              source={{ uri: avatar.url }}
              contentFit='cover'
              transition={300}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          </Animated.View>
        )}

        {(isLoading || isChangingAvatar) && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.absoluteFill, styles.loadingContainer]}>
            <ActivityIndicator size='small' color={Styles.color.orange['500'].color} />
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    height: 96,
    width: 96,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Styles.backgroundColor.white.backgroundColor,
  },
  absoluteFill: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  placeholderContainer: {
    ...Styles.backgroundColor.neutral['100'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
