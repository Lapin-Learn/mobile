export interface ReadingQuestion {
  paragraph?: string;
  question: string;
}

export interface MultipleChoiceQuestion extends ReadingQuestion {
  options: string[];
  answer: number;
}

export interface MultipleChoicesQuestion extends ReadingQuestion {
  options: string[];
  answer: number[];
}

export type Question = MultipleChoiceQuestion | MultipleChoicesQuestion;
