import { Maximize2, Minimize2 } from 'lucide-react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Breakpoint, getBreakpoint } from '~/hooks/useBreakpoint';

export const BreakpointView = ({ children }: { children: React.ReactNode }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      {getBreakpoint() !== Breakpoint.Mobile ? (
        <>
          <ZoomIcon isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000000',
            }}>
            <View
              style={
                getBreakpoint() !== Breakpoint.Mobile && {
                  width: 390,
                  height: 844,
                  transform: [{ scale: isZoomed ? 1.5 : 1 }],
                }
              }>
              {children}
            </View>
          </View>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

const ZoomIcon = ({ isZoomed, setIsZoomed }: { isZoomed: boolean; setIsZoomed: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <Pressable
      onPress={() => setIsZoomed((prev) => !prev)}
      style={{
        position: 'absolute',
        zIndex: 1000,
        right: 16,
        bottom: 16,
      }}>
      {isZoomed ? <Minimize2 size={32} color='#ffffff' /> : <Maximize2 size={32} color='#ffffff' />}
    </Pressable>
  );
};
