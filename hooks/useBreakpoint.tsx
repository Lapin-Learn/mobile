import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export enum Breakpoint {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

const useBreakpoint = () => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number } }) => {
      setWindowWidth(window.width);
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return getBreakpoint({ width: windowWidth });
};

const getBreakpoint = ({ width = Dimensions.get('window').width }: { width?: number } = {}) => {
  if (width < 600) {
    return Breakpoint.Mobile;
  } else if (width < 1200) {
    return Breakpoint.Tablet;
  }
  return Breakpoint.Desktop;
};

export { getBreakpoint };
export default useBreakpoint;
