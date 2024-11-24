import * as FileSystem from 'expo-file-system';

export const deleteUri = async (uri: string) => {
  if (uri) {
    const { exists } = await FileSystem.getInfoAsync(uri);
    if (exists) {
      try {
        await FileSystem.deleteAsync(uri);
      } catch (err) {
        console.error('Failed to delete uri', err);
      }
    }
  }
};
