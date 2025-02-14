import * as ImagePicker from 'expo-image-picker';
import { Skeleton } from 'moti/skeleton';
import { useState } from 'react';
import { Image, PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { useGetUserAvatar, useUploadAvatar } from '~/hooks/react-query/useUser';

export const requestPermission = async () => {
  const isGrantedNotification = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);

  if (!isGrantedNotification) {
    const permissionAppGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
    if (permissionAppGranted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Permission denied');
    }
  }
};

const Avatar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const { data: avatar, isFetching, isSuccess } = useGetUserAvatar();
  const { mutate: uploadAvatar } = useUploadAvatar();

  const handleChangeAvatar = async () => {
    if (isChangingAvatar) return;
    setIsChangingAvatar(true);
    await requestPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const arrBuffer = new Uint8Array(
        atob(result.assets[0].base64 || '')
          .split('')
          .map((c) => c.charCodeAt(0))
      ).buffer;
      uploadAvatar(
        {
          file: arrBuffer,
          avatarId: avatar?.id ?? undefined,
          filename: result.assets[0].fileName ?? 'avatar.jpg',
        },
        {
          onSettled: () => {
            setIsChangingAvatar(false);
          },
        }
      );
    }
  };

  return (
    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
      <TouchableOpacity style={styles.avatar} onPress={handleChangeAvatar} disabled={isLoading}>
        <Skeleton width='100%' height='100%' colorMode='light' />
        {/* No avatar yet */}
        {isSuccess && !avatar && !isChangingAvatar ? (
          <View style={[styles.absoluteFill, { ...Styles.backgroundColor.neutral['100'] }]} />
        ) : avatar && !isFetching && !isChangingAvatar ? (
          <Image
            style={styles.absoluteFill}
            source={{ uri: avatar.url }}
            onLoadStart={() => {
              setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
          />
        ) : null}
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
  },
  absoluteFill: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
