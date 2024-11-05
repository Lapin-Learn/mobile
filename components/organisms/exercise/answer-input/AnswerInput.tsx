import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/types/questions';

import FillInTheBlank from './fill-in-the-blank/FillInTheBlank';
import Matching from './matching/Matching';
import MultipleChoice from './MultipleChoice';

type BaseAnswerInputProps = {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

type AnswerInputProps = BaseAnswerInputProps & IQuestion;
const AnswerInput = (props: AnswerInputProps) => {
  const { contentType, content, ...rest } = props;
  switch (contentType) {
    case ContentTypeEnum.MULTIPLE_CHOICE:
      return <MultipleChoice {...content} {...rest} />;
    case ContentTypeEnum.MATCHING:
      return <Matching {...content} {...rest} />;
    case ContentTypeEnum.FILL_IN_THE_BLANK:
      return <FillInTheBlank {...content} {...rest} />;
    default:
      return null;
  }
};

export default AnswerInput;
