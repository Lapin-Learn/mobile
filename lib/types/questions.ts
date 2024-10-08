import { CEFRLevelEnum, ContentTypeEnum } from '../enums';
import { IBucket } from '../interfaces';

export type ReadingQuestion = {
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
  content: ReadingQuestion & MultipleChoiceContent;
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
  content: ReadingQuestion & MatchingContent;
};

export type TypeQuestion = MultipleChoiceQuestion | MatchingQuestion;
