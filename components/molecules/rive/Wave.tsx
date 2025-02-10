import { StyleProp, View, ViewStyle } from 'react-native';
import Rive, { Fit } from 'rive-react-native';

export function RiveWave({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style ?? {}}>
      <Rive
        url='https://firebasestorage.googleapis.com/v0/b/lapin-learn.appspot.com/o/rive%2Fwave.riv?alt=media&token=cb15d9e7-7874-4baa-905b-c01479502e1a'
        artboardName='sound'
        stateMachineName='main'
        fit={Fit.Cover}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
