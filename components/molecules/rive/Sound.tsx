import Rive, { Fit } from 'rive-react-native';

export function RiveSound() {
  return (
    <Rive
      url='https://uilztdvkyvgjgeqd.public.blob.vercel-storage.com/Rive%20Editor%20File-ldcBVPPRhR9Fc5NG4XrY8wC0Y55DTR.riv'
      artboardName='Artboard'
      animationName='Animation 1'
      fit={Fit.Cover}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
