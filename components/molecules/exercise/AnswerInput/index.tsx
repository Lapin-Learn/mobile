import { Answer } from '~/hooks/useLesson';
import { ContentTypeEnum } from '~/lib/enums';
import { TypeQuestion } from '~/lib/types/questions';

import Matching from './Matching';
import MultipleChoice from './MultipleChoice';

type BaseAnswerInputProps = {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

type AnswerInputProps = BaseAnswerInputProps & TypeQuestion;
const AnswerInput = (props: AnswerInputProps) => {
  const { contentType, content, ...rest } = props;
  switch (contentType) {
    case ContentTypeEnum.MULTIPLE_CHOICE:
      return <MultipleChoice {...content} {...rest} />;
    case ContentTypeEnum.MATCHING:
      return <Matching {...content} {...rest} />;
    default:
      return null;
  }
};

export default AnswerInput;
