import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import UnlockLesson from '~/assets/images/unlock-lesson.svg';
import { Loading } from '~/components/molecules/Loading';
import QuestionTemplate from '~/components/organisms/exercise/QuestionTemplate';
import { LessonResult } from '~/components/organisms/lesson/LessonResult';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useJumpBandQuestions } from '~/hooks/react-query/useDailyLesson';
import { useCurrentQuestionTypeStore, useDailyLessonQuestionStore } from '~/hooks/zustand';
import { GLOBAL_STYLES } from '~/lib/constants';
import { SkillEnum } from '~/lib/enums';

const JumpBand = () => {
  const { t } = useTranslation('question');

  const { questionTypeId, exerciseId } = useLocalSearchParams<{
    questionTypeId: string;
    exerciseId: SkillEnum;
  }>();
  const { currentQuestionType } = useCurrentQuestionTypeStore();
  const { data, isLoading } = useJumpBandQuestions({ questionTypeId });

  const [isStarted, setIsStarted] = useState(false);
  const {
    state: { currentQuestion, isCompleted, result, totalQuestion, currentQuestionIndex, isPendingMutation },
    clear,
    setQuestions,
    mutation,
  } = useDailyLessonQuestionStore(true);

  useEffect(() => {
    if (isCompleted && currentQuestionIndex === totalQuestion - 1) {
      mutation();
    }
  }, [isCompleted]);

  useEffect(() => {
    if (!currentQuestionType) {
      router.replace(`/exercise/${exerciseId}/${questionTypeId}`);
    }
  }, [currentQuestionType]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  const handleStart = () => {
    if (!data) return;
    setIsStarted(true);
    setQuestions(data.questions, data.lastLessonId.toString());
  };

  if (isLoading) return <Loading />;
  if (isStarted) {
    return (
      <View>
        {currentQuestion ? (
          <QuestionTemplate />
        ) : (
          <View style={styles.noQuestionFoundContainer}>
            <Text>{t('general.noQuestionFound')}</Text>
          </View>
        )}
      </View>
    );
  }

  if (isCompleted && result)
    return (
      <View>
        <LessonResult data={result} />
      </View>
    );
  if (isPendingMutation) {
    return (
      <PlatformView>
        <Loading />
      </PlatformView>
    );
  }

  return (
    <PlatformView>
      <View style={styles.root}>
        <UnlockLesson width={120} height={120} />
        <View>
          <Text style={styles.text}>
            Để hoàn thành bài học vượt band, bạn phải đạt được trên{' '}
            <Text style={{ fontWeight: 'bold' }}>90% số điểm</Text> trong bài kiểm tra này.
          </Text>
          <Text style={[styles.text, { marginTop: 12 }]}>
            Bài học có <Text style={{ fontWeight: 'bold' }}>{data?.questions.length ?? 10} câu hỏi.</Text>
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <Button onPress={router.back} size='lg' variant='ghost' style={{ width: '30%' }}>
            <Text style={GLOBAL_STYLES.textButtonGhost}>Trở về</Text>
          </Button>
          <Button onPress={handleStart} size='lg' style={{ flex: 1 }}>
            <Text style={GLOBAL_STYLES.textButton}>Bắt đầu</Text>
          </Button>
        </View>
      </View>
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  noQuestionFoundContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    padding: 16,
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    gap: 24,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  text: {
    textAlign: 'center',
    ...Styles.fontSize.headline,
    marginHorizontal: 32,
  },
});

export default JumpBand;
