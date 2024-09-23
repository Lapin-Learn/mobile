import { ContentTypeEnum } from './enums';

export interface ReadingQuestion {
  paragraph: string;
  question: string;
}

export interface MultipleChoiceQuestion extends ReadingQuestion {
  type: ContentTypeEnum.MULTIPLE_CHOICE;
  options: string[];
  answer: number | number[];
}

export type Question = MultipleChoiceQuestion;
