import _ from 'lodash';

enum AnswerTypeEnum {
  EXACT = 'exact',
  VARIANT = 'variant',
  SUGGEST = 'suggest',
}

const checkingFunctionAnswers = (
  userAnswer: string,
  keyAnswer: string,
  strategies: AnswerTypeEnum = AnswerTypeEnum.EXACT
) => {
  switch (strategies) {
    case AnswerTypeEnum.EXACT:
      return _.trim(userAnswer.toLowerCase()) === _.trim(keyAnswer.toLowerCase());

    default:
      return false;
  }
};

export default checkingFunctionAnswers;
