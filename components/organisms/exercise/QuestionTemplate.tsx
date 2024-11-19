import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { ExitModal } from '~/components/molecules/ExitModal';
import { Loading } from '~/components/molecules/Loading';
import { Progress } from '~/components/ui/Progress';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';
import { ContentTypeEnum } from '~/lib/enums';

import PlatformView from '../../templates/PlatformView';
import AnswerInput from './answer-input/AnswerInput';
import AnswerModal from './AnswerModal';
import QuestionCard from './QuestionCard';

const QuestionTemplate = () => {
  const {
    nextQuestion,
    answerQuestion,
    mutation,
    state: { totalQuestion, learnerAnswers, isCompleted, currentQuestion, currentQuestionIndex, isPendingMutation },
  } = useDailyLessonQuestionStore();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isCompleted && currentQuestionIndex === totalQuestion - 1) {
      mutation();
    }
  }, [isCompleted]);

  useEffect(() => {
    const backAction = () => {
      setIsExiting(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleBack = () => {
    setIsExiting(true);
  };

  if (isPendingMutation) {
    return (
      <PlatformView>
        <Loading />
      </PlatformView>
    );
  }

  const showAnswerModal = learnerAnswers[currentQuestionIndex].totalOfQuestions > 0;

  return (
    <PlatformView
      style={{ paddingBottom: currentQuestion?.contentType === ContentTypeEnum.FILL_IN_THE_BLANK ? 24 : 0 }}>
      <View style={styles.progress}>
        <Pressable style={{ width: 24 }} onPress={handleBack}>
          <LucideMoveLeft color='black' />
        </Pressable>
        <Progress value={((currentQuestionIndex + 1) / totalQuestion) * 100} />
      </View>
      {currentQuestion && (
        <View style={styles.currentQuestion}>
          <QuestionCard data={currentQuestion} isPaused={typeof learnerAnswers[currentQuestionIndex] == 'boolean'} />
          <View style={{ flex: 1, flexGrow: 1, paddingHorizontal: 16, paddingBottom: showAnswerModal ? 64 : 0 }}>
            <AnswerInput onAnswer={answerQuestion} result={learnerAnswers[currentQuestionIndex]} {...currentQuestion} />
          </View>
        </View>
      )}
      {showAnswerModal && (
        <AnswerModal
          type={
            learnerAnswers[currentQuestionIndex].numberOfCorrect /
              learnerAnswers[currentQuestionIndex].totalOfQuestions >
            0.5
              ? 'correct'
              : 'incorrect'
          }
          // TODO: Fix correctAnswers, map from currentQuestion?.content.answer from number[] to string[]
          // correctAnswers={currentQuestion?.content.answer ?? []}
          onPressContinue={nextQuestion}
        />
      )}
      {isExiting && <ExitModal onClose={() => setIsExiting(false)} />}
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  progress: {
    marginHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 8,
  },
  currentQuestion: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
});

export default QuestionTemplate;
