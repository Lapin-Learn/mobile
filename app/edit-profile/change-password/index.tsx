import { Platform, SafeAreaView } from 'react-native';

import { NavigationBar } from '~/components/molecules/NavigationBar';

export default function ChangePassword() {
  return (
    <SafeAreaView className={`h-full ${Platform.OS === 'android' ? 'py-10' : ''}`}>
      <NavigationBar headerTitle={'Mật khẩu'} headerLeftShown />
    </SafeAreaView>
  );
}
