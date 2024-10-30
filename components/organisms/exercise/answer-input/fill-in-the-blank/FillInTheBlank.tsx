import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { FillInTheBlankContent, FillInTheBlankContentType } from '~/lib/types/questions';

import FillInTheBlankContentRenderer from './TypeRendering';

type FillInTheBlankProps = FillInTheBlankContent & {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

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
  const { control, handleSubmit, reset } = useForm<FormField>({
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

  const answerQuestion = () => {
    const isCorrect = field.value.every((value, index) => value === blankContent[index]);
    onAnswer(isCorrect);
  };

  useEffect(() => {
    if (result === 'notAnswered') {
      reset();
      setIsChecking(false);
    }
  }, [result]);

  const handleTextChange = (text: string, index: number, field: any) => {
    const newAnswer = [...field.value];
    newAnswer[index] = text;
    field.onChange(newAnswer);
  };

  const onSubmit: SubmitHandler<FormField> = () => {
    answerQuestion();
  };

  return (
    <>
      <ScrollView
        style={[styles.scrollView, isChecking && styles.scrollViewWithChecking]}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps='handled'>
        <KeyboardAvoidingView
          behavior='position'
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
          <View style={styles.contentContainer}>
            <FillInTheBlankContentRenderer
              content={content}
              fieldState={field}
              onTextChange={handleTextChange}
              hasSubmission={result !== 'notAnswered'}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {isChecking && (
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText} className='text-button'>
              {t('general.check')}
            </Text>
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 40,
  },
  scrollViewWithChecking: {
    marginBottom: 88,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    columnGap: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    rowGap: 4,
  },
  textInput: {
    padding: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  button: {
    ...Styles.backgroundColor.neutral[900],
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default FillInTheBlank;
