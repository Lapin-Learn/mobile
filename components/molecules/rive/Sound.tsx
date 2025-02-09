import { useEffect, useRef } from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';

type RiveSoundProps = {
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
};
export function RiveSound({ isPlaying = false }: RiveSoundProps) {
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    riveRef.current?.setInputState('main', 'isPlaying', isPlaying);
  }, [isPlaying]);

  return (
    <Rive
      url='https://firebasestorage.googleapis.com/v0/b/lapin-learn.appspot.com/o/rive%2Fspeaker.riv?alt=media&token=9bf6095e-e794-4cd2-be47-5d541b0c3dee'
      artboardName='sound'
      stateMachineName='main'
      fit={Fit.Contain}
      style={{ width: '100%', height: '100%' }}
      ref={riveRef}
    />
  );
}
