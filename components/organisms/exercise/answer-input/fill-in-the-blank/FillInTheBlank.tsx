import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { z } from 'zod';

import { BaseAnswerInputProps } from '~/components/organisms/exercise/answer-input/AnswerInput';
import { FillInTheBlankContent, FillInTheBlankContentType } from '~/lib/types/questions';

import ButtonCheck from '../../ButtonCheck';
import checkingFunctionAnswers from './helper';
import FillInTheBlankContentRenderer from './TypeRendering';

type FillInTheBlankProps = FillInTheBlankContent & BaseAnswerInputProps;

const getBlankAnswer = (content: FillInTheBlankContentType[]): (string | undefined)[] => {
  return content.flatMap((item) => {
    if (item.type === 'blank') {
      return item.text;
    } else if (item.type === 'paragraph' && item.content) {
      return getBlankAnswer(item.content);
    } else {
      return [];
    }
  });
};

const FillInTheBlank = ({ content, onAnswer, result }: FillInTheBlankProps) => {
  const blankContent = getBlankAnswer(content);
  const schema = z.object({
    answer: z.array(z.string()).length(blankContent.length),
  });

  type FormField = z.infer<typeof schema>;
  const { control, reset } = useForm<FormField>({
    defaultValues: { answer: Array(blankContent.length).fill('') },
    resolver: zodResolver(schema),
  });

  const { field } = useController({ name: 'answer', control });
  const { t } = useTranslation('question');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (field.value.some((value) => value.length > 0)) {
      setIsChecking(true);
    } else {
      setIsChecking(false);
    }
  }, [field.value]);

  // For keyboard avoiding
  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    AvoidSoftInput.setEnabled(true);
    return () => {
      AvoidSoftInput.setEnabled(false);
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);
  useFocusEffect(onFocusEffect);

  const answerQuestion = () => {
    const numberOfCorrect = field.value.reduce((acc, value, index) => {
      return checkingFunctionAnswers(value, blankContent[index] ?? '') ? acc + 1 : acc;
    }, 0);
    onAnswer({
      numberOfCorrect: numberOfCorrect,
      totalOfQuestions: blankContent.length,
    });
  };

  useEffect(() => {
    if (result.numberOfCorrect === 0 && result.totalOfQuestions === 0) {
      reset({ answer: Array(blankContent.length).fill('') });
      setIsChecking(false);
    }
  }, [result, reset, blankContent.length]);

  const handleTextChange = (text: string, index: number, field: any) => {
    const newAnswer = [...field.value];
    newAnswer[index] = text;
    field.onChange(newAnswer);
  };

  return (
    <>
      <ScrollView style={[{ flex: 1 }]}>
        <FillInTheBlankContentRenderer
          content={content}
          fieldState={field}
          onTextChange={handleTextChange}
          hasSubmission={result.totalOfQuestions === field.value.length}
        />
      </ScrollView>
      {isChecking && (
        <>
          <ButtonCheck handleCheckAnswer={answerQuestion} content={t('general.check')} />
        </>
      )}
    </>
  );
};

export default FillInTheBlank;
