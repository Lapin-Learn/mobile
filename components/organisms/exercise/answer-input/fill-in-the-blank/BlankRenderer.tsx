import { ControllerRenderProps } from 'react-hook-form';

import FillInTheBlankInput from './FillInTheBlankInput';
export type FieldState = ControllerRenderProps<{ answer: string[] }, 'answer'>;

type BlankRendererProps = {
  index: number;
  fieldState: FieldState;
  onTextChange: (text: string, index: number, field: FieldState) => void;
  correctAnswer: string;
  isAnswerCorrect: boolean | null;
};

const BlankRenderer = ({ index, fieldState, onTextChange, correctAnswer, isAnswerCorrect }: BlankRendererProps) => {
  return (
    <FillInTheBlankInput
      key={`blank-${index}`}
      index={index}
      field={fieldState}
      onChange={onTextChange}
      answer={correctAnswer}
      isCorrect={isAnswerCorrect}
    />
  );
};
export default BlankRenderer;
