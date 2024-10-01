import { ContentTypeEnum } from './enums';

export interface BaseQuestion {
  type: ContentTypeEnum;
  question?: string;
}

export interface ReadingQuestion extends BaseQuestion {
  paragraph: string;
}

export interface MultipleChoiceAnswer {
  answer: number[];
}

export interface MultipleChoiceQuestion extends ReadingQuestion, MultipleChoiceAnswer {
  options: string[];
}

export interface PairAnswer {
  columnA: string[];
  columnB: string[];
}

export interface MatchingAnswer {
  answer: PairAnswer[];
}

export interface MatchingQuestion extends ReadingQuestion, MatchingAnswer {
  columnA: {
    title: string;
    options: string[];
  };
  columnB: {
    title: string;
    options: string[];
  };
}

export type Question = MultipleChoiceQuestion | MatchingQuestion;
