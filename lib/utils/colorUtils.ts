import { default as Styles } from '~/constants/GlobalStyles';
const getTextColorCorrectness = (correctness: boolean | null | undefined) => {
  if (correctness === null || correctness === undefined) {
    return {};
  }
  if (correctness) {
    return Styles.color.green[500];
  }
  return Styles.color.red[500];
};

const getBackgroundColorCorrectness = (correctness: boolean | null | undefined) => {
  if (correctness === null || correctness === undefined) {
    return {};
  }
  if (correctness) {
    return Styles.backgroundColor.green[500];
  }
  return Styles.backgroundColor.red[500];
};

export { getBackgroundColorCorrectness, getTextColorCorrectness };
