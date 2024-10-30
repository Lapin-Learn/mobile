import { StyleSheet } from 'react-native';

export const NAV_THEME = {
  light: {
    background: 'hsl(16 11% 97%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

export const QUERY_KEYS = {
  list: 'list',
  detail: 'detail',
  streak: 'streak',
  questionTypes: 'questionTypes',
  instruction: 'instruction',
  questions: 'questions',
  lessonQuestions: 'lessonQuestions',
  missions: 'missions',
  profile: {
    identifier: 'accountIdentifier',
    user: 'userProfile',
    game: 'gameProfile',
  },
};

export const AUTHEN_ERRORS: Record<string, string> = {
  EMAIL_EXISTS: 'emailExists',
  EMAIL_NOT_FOUND: 'emailNotFound',
  INVALID_PASSWORD: 'invalidPassword',
  INVALID_EMAIL: 'invalidEmail',
};

export const FONTS = StyleSheet.create({
  regular: {
    fontFamily: 'Inter-Regular',
  },
  medium: {
    fontFamily: 'Inter-Medium',
  },
  semibold: {
    fontFamily: 'Inter-SemiBold',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
});

export const TEXTS = StyleSheet.create({
  footnote: {
    fontSize: 13,
    lineHeight: 18,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 22.5,
  },
  body: {
    fontSize: 16,
    lineHeight: 21,
  },
  large: {
    fontSize: 18,
    lineHeight: 28,
  },
  title2: {
    fontSize: 22,
    lineHeight: 33,
  },
  title4: {
    fontSize: 17,
    lineHeight: 25.5,
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 51,
  },
});

export const GLOBAL_STYLES = StyleSheet.create({
  textButton: {
    ...FONTS.semibold,
    ...TEXTS.body,
    color: 'white',
  },
});

export const COLORS = {
  neutral: {
    900: '#272727',
  },
  orange: {
    500: '#ee5d28',
  },
  red: {
    500: '#ff4b4b',
  },
  supportingText: '#929292',
};
