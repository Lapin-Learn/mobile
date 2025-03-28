import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/types/questions';

import FillInTheBlank from './fill-in-the-blank/FillInTheBlank';
import Matching from './Matching';
import MultipleChoice from './MultipleChoice';

export type BaseAnswerInputProps = {
  onAnswer: (answer: Answer) => void;
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
