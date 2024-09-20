export type MultipleChoiceQuestion = {
  id: string;
  paragraph: string;
  question: string;
  options: string[];
  answer: number;
};

export type FillInTheBlankQuestion = {
  id: string;
  paragraph: string;
  question: string;
  answer: string;
};

export type MatchingQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number[];
};

export type Question = MultipleChoiceQuestion | FillInTheBlankQuestion | MatchingQuestion;
