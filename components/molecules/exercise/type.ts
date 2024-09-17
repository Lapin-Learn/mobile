export interface Question {
  id: string;
  content: string;
  questionType: string;
  question: string;
  choices: string[];
  answer: number;
}

export type AnswerModalProps = {
  correctAnswer?: string | null;
  explanation?: string | null;
  onPressContinue: () => void;
};
