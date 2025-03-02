import { StyleSheet, Text, View } from 'react-native';

import { default as TextRenderer } from '~/components/molecules/BreakableText';
import Styles from '~/constants/GlobalStyles';
import { FillInTheBlankContentType } from '~/lib/types/questions';

import BlankRenderer, { type FieldState } from './BlankRenderer';
import checkingFunctionAnswers from './helper';

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
  const renderContent = elements.map((element, index) => {
    if (element.type === 'text' && element.text) {
      return <TextRenderer key={`text-${index}`} text={element.text} />;
    } else if (element.type === 'blank' && element.text) {
      const blankIndex = blankCounter.current++;
      return (
        <BlankRenderer
          key={`blank-${blankCounter.current}`}
          index={blankIndex}
          fieldState={fieldState}
          onTextChange={onTextChange}
          correctAnswer={element.text}
          isAnswerCorrect={hasSubmission ? checkingFunctionAnswers(fieldState.value[blankIndex], element.text) : null}
        />
      );
    } else if (element.type === 'break') {
      return <FillInTheBlankSpacer key={`break-${index}`} />;
    }
    return null;
  });

  return <View style={styles.container}>{renderContent}</View>;
};

type FillInTheBlankContentRendererProps = {
  content: FillInTheBlankContentType[];
  fieldState: FieldState;
  onTextChange: (text: string, index: number, field: FieldState) => void;
  hasSubmission: boolean;
};

const FillInTheBlankSpacer = () => <Text style={styles.spacer} />;
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
              isAnswerCorrect={
                hasSubmission ? checkingFunctionAnswers(fieldState.value[blankIndex], element.text) : null
              }
            />
          );
        } else if (element.type === 'break') {
          return <FillInTheBlankSpacer key={`break-${index}`} />;
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
    paddingBottom: 120,
  },
  textInput: {
    height: 'auto',
    ...Styles.font.normal,
    ...Styles.fontSize.callout,
    ...Styles.color.black,
  },
  spacer: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
});
