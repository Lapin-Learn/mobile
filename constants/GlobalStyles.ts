const font: {
  [key in 'normal' | 'italic' | 'medium' | 'semibold' | 'bold' | 'black']: {
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
  black: {
    fontFamily: `Inter-Black`,
  },
};

const fontSize = {
  'large-title': {
    fontSize: 34,
    lineHeight: 51,
  },
  'title-1': {
    fontSize: 28,
    lineHeight: 42,
  },
  'title-2': {
    fontSize: 22,
    lineHeight: 33,
  },
  'title-3': {
    fontSize: 20,
    lineHeight: 25,
  },
  'title-4': {
    fontSize: 17,
    lineHeight: 25.5,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 22.5,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
  },
  'caption-1': {
    fontSize: 12,
    lineHeight: 16,
  },
  'caption-2': {
    fontSize: 11,
    lineHeight: 13,
  },
  streak: {
    fontSize: 64,
    lineHeight: 64,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
};

const baseColors = {
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
  secondary: '#f2f2f2',
  destructive: '#ff4b4b',
  foreground: '#f0f0f0',
  black: '#000000',
};

type BaseColors = typeof baseColors;

type ColorStyle<T extends string> = {
  [K in keyof BaseColors]: BaseColors[K] extends string
    ? { [P in T]: BaseColors[K] }
    : { [S in keyof BaseColors[K]]: { [P in T]: BaseColors[K][S] } };
};

const createColorStyle = <T extends string>(style: T): ColorStyle<T> =>
  Object.fromEntries(
    Object.entries(baseColors).map(([colorName, shades]) => [
      colorName,
      typeof shades === 'string'
        ? { [style]: shades }
        : Object.fromEntries(Object.entries(shades).map(([shade, hex]) => [shade, { [style]: hex }])),
    ])
  ) as ColorStyle<T>;

const color = createColorStyle('color');
const backgroundColor = createColorStyle('backgroundColor');
const borderColor = createColorStyle('borderColor');

type StyleProps = {
  fontSize: typeof fontSize;
  font: typeof font;
  color: typeof color;
  backgroundColor: typeof backgroundColor;
  borderColor: typeof borderColor;
};

const Styles: StyleProps = {
  font,
  fontSize,
  color,
  backgroundColor: backgroundColor,
  borderColor: borderColor,
};

export default Styles;
