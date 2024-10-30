import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { FillInTheBlankContent } from '~/lib/types/questions';

import FillInTheBlankInput from './FillInTheBlankInput';

type FillInTheBlankProps = FillInTheBlankContent & {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

const FillInTheBlank = ({ content, onAnswer, result }: FillInTheBlankProps) => {
  const blankContent = content.filter((item) => item.type === 'blank');
  const schema = z.object({
    answer: z.array(z.string()).length(blankContent.length),
  });

  type FormField = z.infer<typeof schema>;
  const { control, handleSubmit } = useForm<FormField>({
    defaultValues: { answer: Array(blankContent.length).fill('') },
    resolver: zodResolver(schema),
  });

  const { field } = useController({ name: 'answer', control });
  const { t } = useTranslation('question');
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let blankIndex = 0;

  useEffect(() => {
    field.value.forEach((value) => {
      if (value.length > 0) {
        setIsChecking(true);
      }
    });
  }, [field.value]);

  const answerQuestion = () => {
    const isCorrect = field.value.every((value, index) => value === blankContent[index].text);
    onAnswer(isCorrect);
  };

  useEffect(() => {
    if (result === 'notAnswered') field.onChange(Array(blankContent.length).fill(''));
  }, [result]);

  const handleTextChange = (text: string, index: number, field: any) => {
    const newAnswer = [...field.value];
    newAnswer[index] = text;
    field.onChange(newAnswer);
  };

  const onSubmit: SubmitHandler<FormField> = () => {
    setIsSubmitted((prev) => !prev);
    answerQuestion();
  };

  return (
    <>
      <ScrollView style={[styles.scrollView, isChecking && styles.scrollViewWithChecking]}>
        <View style={styles.contentContainer}>
          {content.map((item, index) => {
            if (item.type === 'blank') {
              blankIndex += 1;
            }
            if (item.type === 'text') {
              return (
                <View key={index} style={styles.container}>
                  <TextInput readOnly value={item.text} multiline textBreakStrategy='simple' style={styles.textInput} />
                </View>
              );
            } else if (item.type === 'blank') {
              return (
                <FillInTheBlankInput
                  key={index}
                  index={blankIndex - 1}
                  field={field}
                  onChange={handleTextChange}
                  answer={item.text ?? ''}
                  isCorrect={isSubmitted ? field.value[blankIndex - 1] === item.text : null}
                />
              );
            }
          })}
        </View>
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
