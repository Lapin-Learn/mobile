import * as FileSystem from 'expo-file-system';

export const deleteUri = async (uri: string) => {
  if (uri) {
    const { exists } = await FileSystem.getInfoAsync(uri);
    if (exists) {
      await FileSystem.deleteAsync(uri);
    }
  }
};
