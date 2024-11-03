import { StyleSheet, Text, View } from 'react-native';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';

const Items = () => {
  return (
    <PlatformView>
      <NavigationBar headerTitle='Items' headerLeftShown />
      <View style={styles.itemView}>
        <Text>Items</Text>
      </View>
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  itemView: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Items;
