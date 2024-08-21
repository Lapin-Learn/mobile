import Toast from 'react-native-toast-message';
export const useToast = () => {
  const toast = (message: string, type: 'success' | 'error' | 'info' | 'any') => {
    Toast.show({
      type,
      text1: message,
    });
  };
  return toast;
};
