import { MultipleChoiceDecoration, QuestionCardDecoration } from '~/lib/types/question-style';

const getQuestionCardDecoration = (paragraph: string = ''): QuestionCardDecoration => {
  if (paragraph.length > 400) {
    return { isScrollable: true };
  }
  return { isScrollable: false };
};

const getDefaultMultipleChoiceDecoration = (numberOfAnwsers: number): MultipleChoiceDecoration => {
  if (numberOfAnwsers > 1) {
    return { choice: 'checkbox' };
  }
  return { choice: 'radio' };
};

const getMultipleChoiceDecoration = (options: string[], numberOfAnwsers: number): MultipleChoiceDecoration => {
  if (options.length <= 6 && options.every((option) => option.length <= 50)) {
    return { choice: 'button' };
  }
  if (numberOfAnwsers > 1) {
    return { choice: 'checkbox' };
  }
  return { choice: 'radio' };
};
export { getDefaultMultipleChoiceDecoration, getMultipleChoiceDecoration, getQuestionCardDecoration };
