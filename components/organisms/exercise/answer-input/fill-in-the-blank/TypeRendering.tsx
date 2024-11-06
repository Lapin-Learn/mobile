import { ControllerRenderProps } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { FillInTheBlankContentType } from '~/lib/types/questions';

import FillInTheBlankInput from './FillInTheBlankInput';

type FieldState = ControllerRenderProps<{ answer: string[] }, 'answer'>;

const TextRenderer = ({ text }: { text: string }) => {
  if (text.charAt(0) === ' ') {
    text = text.slice(1);
  }
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      <Text key={`text-${text}`} allowFontScaling style={styles.textInput}>
        {text}
      </Text>
    </View>
  );
};

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

type ParagraphRendererProps = {
  elements: FillInTheBlankContentType[];
  fieldState: FieldState;
  blankCounter: { current: number };
  onTextChange: (text: string, index: number, field: FieldState) => void;
  hasSubmission: boolean;
};

const ParagraphRenderer = ({
  elements,
  fieldState,
  blankCounter,
  onTextChange,
  hasSubmission,
}: ParagraphRendererProps) => {
  const children: JSX.Element[] = [];

  elements?.forEach((element) => {
    if (element.type === 'text' && element.text) {
      children.push(<TextRenderer key={`text-${element.text}`} text={element.text} />);
    } else if (element.type === 'blank' && element.text) {
      children.push(
        <BlankRenderer
          key={`blank-${blankCounter.current}`}
          index={blankCounter.current}
          fieldState={fieldState}
          onTextChange={onTextChange}
          correctAnswer={element.text}
          isAnswerCorrect={hasSubmission ? fieldState.value[blankCounter.current] === element.text : null}
        />
      );
      blankCounter.current += 1;
    } else if (element.type === 'break') {
      children.push(<Text key={`break-${Math.random()}`} style={[styles.textInput, { flex: 1 }]} />);
    }
  });

  return <View style={styles.container}>{children}</View>;
};

type FillInTheBlankContentRendererProps = {
  content: FillInTheBlankContentType[];
  fieldState: FieldState;
  onTextChange: (text: string, index: number, field: FieldState) => void;
  hasSubmission: boolean;
};

const FillInTheBlankContentRenderer = ({
  content,
  fieldState,
  onTextChange,
  hasSubmission,
}: FillInTheBlankContentRendererProps) => {
  const blankCounter = { current: 0 };
  return (
    <View style={styles.container}>
      {content.map((element, index) => {
        if (element.type === 'paragraph' && element.content) {
          return (
            <ParagraphRenderer
              key={`paragraph-${index}`}
              elements={element.content}
              fieldState={fieldState}
              blankCounter={blankCounter}
              onTextChange={onTextChange}
              hasSubmission={hasSubmission}
            />
          );
        } else if (element.type === 'text' && element.text) {
          return <TextRenderer key={`text-${index}`} text={element.text} />;
        } else if (element.type === 'blank' && element.text) {
          const blankIndex = blankCounter.current++;
          return (
            <BlankRenderer
              key={`blank-${blankIndex}`}
              index={blankIndex}
              fieldState={fieldState}
              onTextChange={onTextChange}
              correctAnswer={element.text}
              isAnswerCorrect={hasSubmission ? fieldState.value[blankIndex] === element.text : null}
            />
          );
        } else if (element.type === 'break') {
          return <Text key={`break-${index}`}>{'\n'}</Text>;
        }
        throw new Error(`Unknown element type: ${element.type}`);
      })}
    </View>
  );
};

export default FillInTheBlankContentRenderer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  textInput: {
    height: 'auto',
    ...Styles.fontSize.body,
    ...Styles.color.black,
  },
});
