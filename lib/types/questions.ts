import { IBucket } from '.';
import { CEFRLevelEnum, ContentTypeEnum } from '../enums';

export type QuestionCard = {
  paragraph: string;
  question: string;
};

export type BaseQuestion = {
  id: string;
  explanation: string | null;
  cefrLevel: CEFRLevelEnum;
  imageId: string | null;
  image: IBucket | null;
  audioId: string | null;
  audio: IBucket | null;
  createdAt: string;
  updatedAt: string;
};

export type MultipleChoiceContent = {
  options: string[];
  answer: number[];
};

type MultipleChoiceQuestion = BaseQuestion & {
  contentType: ContentTypeEnum.MULTIPLE_CHOICE;
  content: QuestionCard & MultipleChoiceContent;
};

export type Column = 'columnA' | 'columnB';
export type PairAnswer = Record<Column, string[]>;
export type MatchingContent = {
  columnA: {
    title: string;
    options: string[];
  };
  columnB: {
    title: string;
    options: string[];
  };
  answer: PairAnswer[];
};

type MatchingQuestion = BaseQuestion & {
  contentType: ContentTypeEnum.MATCHING;
  content: QuestionCard & MatchingContent;
};

// type FillInTheBlankMark = {
//   type: 'blank';
// };
type FillInTheBlankAnswer = {
  answer: string;
};
export type FillInTheBlankContent = {
  content: {
    type: 'text' | 'blank';
    text?: string;
    content?: FillInTheBlankContent;
  }[];
};

type FillInTheBlankQuestion = BaseQuestion & {
  contentType: ContentTypeEnum.FILL_IN_THE_BLANK;
  content: QuestionCard & FillInTheBlankContent;
};

export type IQuestion = MultipleChoiceQuestion | MatchingQuestion | FillInTheBlankQuestion;
