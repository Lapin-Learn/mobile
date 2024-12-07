import Rive, { Fit } from 'rive-react-native';

export function Wave() {
  return (
    <Rive
      url='https://uilztdvkyvgjgeqd.public.blob.vercel-storage.com/Wave-QgPdR3YFYZoIxKhuaOqQZspE2Pc05k.riv'
      artboardName='Artboard'
      stateMachineName='State Machine 1'
      fit={Fit.Cover}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
