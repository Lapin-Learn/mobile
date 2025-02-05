import DeviceInfo from 'react-native-device-info';

import { EXCEPTION_DEVICES } from '~/lib/exceptions';

export const Font: {
  [key in 'normal' | 'italic' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'extralight' | 'black']: {
    fontFamily: string;
    fontStyle?: 'italic';
  };
} = {
  normal: {
    fontFamily: `Inter-Regular`,
  },
  italic: {
    fontFamily: `Inter-Italic`,
    fontStyle: 'italic',
  },
  medium: {
    fontFamily: `Inter-Medium`,
  },
  semibold: {
    fontFamily: `Inter-SemiBold`,
  },
  bold: {
    fontFamily: `Inter-Bold`,
  },
  extrabold: {
    fontFamily: `Inter-ExtraBold`,
  },
  extralight: {
    fontFamily: `Inter-ExtraLight`,
  },
  black: {
    fontFamily: `Inter-Black`,
  },
};

export const FontSize = {
  'large-title': {
    fontSize: 34,
  },
  'title-1': {
    fontSize: 28,
  },
  'title-2': {
    fontSize: 22,
  },
  'title-3': {
    fontSize: 20,
  },
  'title-4': {
    fontSize: 17,
  },
  headline: {
    fontSize: 17,
  },
  body: {
    fontSize: 17,
  },
  callout: {
    fontSize: 16,
  },
  subhead: {
    fontSize: 15,
  },
  footnote: {
    fontSize: 13,
  },
  'caption-1': {
    fontSize: 12,
  },
  'caption-2': {
    fontSize: 11,
  },
  streak: {
    fontSize: 64,
  },
  lg: {
    fontSize: 18,
  },
};

export const IconSize = {
  sm: {
    width: 20,
    height: 20,
  },
  base: {
    width: 24,
    height: 24,
  },
  md: {
    width: 28,
    height: 28,
  },
  lg: {
    width: 36,
    height: 36,
  },
};

export const BaseColors = {
  orange: {
    50: '#fdefea',
    100: '#facdbc',
    200: '#f7b49c',
    300: '#f4926f',
    400: '#f17d53',
    500: '#ee5d28',
    600: '#d95524',
    700: '#a9421c',
    800: '#833316',
    900: '#642711',
  },
  green: {
    50: '#eefae6',
    100: '#cbefb1',
    200: '#b2e88b',
    300: '#8fdd55',
    400: '#79d635',
    500: '#58cc02',
    600: '#50ba02',
    700: '#3e9101',
    800: '#307001',
    900: '#255601',
  },
  red: {
    50: '#ffeded',
    100: '#ffc7c7',
    200: '#ffacac',
    300: '#ff8686',
    400: '#ff6f6f',
    500: '#ff4b4b',
    600: '#e84444',
    700: '#b53535',
    800: '#8c2929',
    900: '#6b2020',
  },
  yellow: {
    50: '#fffced',
    100: '#fff6c7',
    200: '#fff2ac',
    300: '#ffec86',
    400: '#ffe86f',
    500: '#ffe24b',
    600: '#e8ce44',
    700: '#b5a035',
    800: '#8c7c29',
    900: '#6b5f20',
  },
  purple: {
    50: '#f9eeff',
    100: '#ebcbff',
    200: '#e1b2ff',
    300: '#d38eff',
    400: '#cb79ff',
    500: '#be57ff',
    600: '#ad4fe8',
    700: '#873eb5',
    800: '#69308c',
    900: '#50256b',
  },
  neutral: {
    50: '#efefef',
    100: '#cccccc',
    200: '#b4b4b4',
    300: '#929292',
    400: '#7d7d7d',
    500: '#5c5c5c',
    600: '#545454',
    700: '#414141',
    800: '#333333',
    900: '#272727',
  },
  blue: {
    DEFAULT: '#37aeff',
    50: '#ebf7ff',
    100: '#c1e6ff',
    200: '#a3daff',
    300: '#79c9ff',
    400: '#5fbeff',
    500: '#37aeff',
    600: '#329ee8',
    700: '#277cb5',
    800: '#1e608c',
    900: '#17496b',
  },
  dark: '#272727',
  supportingText: '#929292',
  background: '#f9f7f7',
  white: '#ffffff',
  border: '#e0e0e0',
  primary: 'hsl(16 85% 55%)',
  secondary: '#f2f2f2',
  destructive: '#ff4b4b',
  foreground: '#f0f0f0',
  black: '#000000',
  transparent: 'transparent',
  onSurface: '#0F4910',
};

type ColorStyle<T extends string> = {
  [K in keyof typeof BaseColors]: (typeof BaseColors)[K] extends string
    ? { [P in T]: (typeof BaseColors)[K] }
    : { [S in keyof (typeof BaseColors)[K]]: { [P in T]: (typeof BaseColors)[K][S] } };
};

const createColorStyle = <T extends string>(style: T): ColorStyle<T> =>
  Object.fromEntries(
    Object.entries(BaseColors).map(([colorName, shades]) => [
      colorName,
      typeof shades === 'string'
        ? { [style]: shades }
        : Object.fromEntries(Object.entries(shades).map(([shade, hex]) => [shade, { [style]: hex }])),
    ])
  ) as ColorStyle<T>;

type FontSizeStyle = {
  [K in keyof typeof FontSize]: (typeof FontSize)[K];
};

const createFontSizeStyle = <T extends string>(style: T, deviceName?: T): FontSizeStyle =>
  Object.fromEntries(
    Object.entries(FontSize).map(([sizeName, { fontSize }]) => {
      if (deviceName && EXCEPTION_DEVICES.includes(deviceName)) {
        return [
          sizeName,
          {
            [style]: fontSize * 0.9,
          },
        ];
      }
      return [
        sizeName,
        {
          [style]: fontSize,
        },
      ];
    })
  ) as FontSizeStyle;

type StyleProps = {
  fontSize: FontSizeStyle;
  font: typeof Font;
  color: ColorStyle<'color'>;
  backgroundColor: ColorStyle<'backgroundColor'>;
  borderColor: ColorStyle<'borderColor'>;
  iconSize: typeof IconSize;
};

const Styles = () => {
  const deviceName = DeviceInfo.getDeviceNameSync();
  const color = createColorStyle('color');
  const backgroundColor = createColorStyle('backgroundColor');
  const borderColor = createColorStyle('borderColor');
  const fontSize = createFontSizeStyle('fontSize', deviceName);

  return {
    font: Font,
    fontSize,
    color,
    backgroundColor,
    borderColor,
    iconSize: IconSize,
  } as StyleProps;
};

export { BaseColors as Colors };
export default Styles();
