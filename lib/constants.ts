import { StyleSheet } from 'react-native';

import Styles from '~/constants/GlobalStyles';

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
  jumpBandQuestions: 'jumpBandQuestions',
  missions: 'missions',
  shop: 'shop',
  inventory: 'inventory',
  profile: {
    identifier: 'accountIdentifier',
    user: 'userProfile',
    game: 'gameProfile',
    privacy: 'privacyPolicy',
  },
};

export const AUTH_ERRORS: Record<string, string> = {
  EMAIL_EXISTS: 'emailExists',
  EMAIL_NOT_FOUND: 'emailNotFound',
  INVALID_PASSWORD: 'invalidAuth',
  INVALID_EMAIL: 'invalidAuth',
  INVALID_LOGIN_CREDENTIALS: 'INVALID_LOGIN_CREDENTIALS',
};

export const GLOBAL_STYLES = StyleSheet.create({
  checkButtonView: {
    ...Styles.backgroundColor.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    marginHorizontal: 16,
  },
  textButton: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
    ...Styles.color.white,
  },
  textButtonGhost: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
    ...Styles.color.primary,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000033',
    zIndex: 10,
  },
});
