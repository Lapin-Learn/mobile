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
  textColumnKey?: Column;
};

type MatchingQuestion = BaseQuestion & {
  contentType: ContentTypeEnum.MATCHING;
  content: QuestionCard & MatchingContent;
};

export type FillInTheBlankContentType = FillInTheBlankContent & {
  type: 'text' | 'blank' | 'paragraph' | 'break';
  text?: string;
};

export type FillInTheBlankContent = {
  content: FillInTheBlankContentType[];
};

type FillInTheBlankQuestion = BaseQuestion & {
  contentType: ContentTypeEnum.FILL_IN_THE_BLANK;
  content: QuestionCard & FillInTheBlankContent;
};

type PronounciationQuestion = BaseQuestion & {
  contentType: ContentTypeEnum.PRONUNCIATION;
  content: QuestionCard;
};

export type IQuestion = MultipleChoiceQuestion | MatchingQuestion | FillInTheBlankQuestion | PronounciationQuestion;
