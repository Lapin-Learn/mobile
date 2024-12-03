import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { ExitModal } from '~/components/molecules/ExitModal';
import { Loading } from '~/components/molecules/Loading';
import { Progress } from '~/components/ui/Progress';
import { useDailyLessonQuestionStore, useSpeakingStore } from '~/hooks/zustand';
import { ContentTypeEnum } from '~/lib/enums';
import { getAccurateIPA } from '~/lib/utils';

import PlatformView from '../../templates/PlatformView';
import AnswerInput from './answer-input/AnswerInput';
import Speaking from './answer-input/speaking/Speaking';
import AnswerModal from './AnswerModal';
import QuestionCard from './QuestionCard';

const QuestionTemplate = () => {
  const {
    nextQuestion,
    answerQuestion,
    mutation,
    state: { totalQuestion, learnerAnswers, isCompleted, currentQuestion, currentQuestionIndex, isPendingMutation },
  } = useDailyLessonQuestionStore();
  const { result, setResult } = useSpeakingStore();
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
  const { accCorrectLetters, accIncorrectLetters } = getAccurateIPA(result?.correct_letters ?? []);

  return (
    <PlatformView
      style={{ paddingBottom: currentQuestion?.contentType === ContentTypeEnum.FILL_IN_THE_BLANK ? 24 : 0 }}>
      <View style={styles.progress}>
        <Pressable style={{ width: 24 }} onPress={handleBack}>
          <LucideMoveLeft color='black' />
        </Pressable>
        <Progress value={((currentQuestionIndex + 1) / totalQuestion) * 100} />
      </View>
      {/* For Speaking */}
      <>
        {currentQuestion?.contentType === ContentTypeEnum.PRONUNCIATION ? (
          <Speaking onAnswer={answerQuestion} data={currentQuestion} />
        ) : (
          <>
            {currentQuestion && (
              <View style={styles.currentQuestion}>
                <QuestionCard data={currentQuestion} isPaused={showAnswerModal} />
                <View style={{ flex: 1, flexGrow: 1, paddingHorizontal: 16, paddingBottom: showAnswerModal ? 64 : 0 }}>
                  <AnswerInput
                    onAnswer={answerQuestion}
                    result={learnerAnswers[currentQuestionIndex]}
                    {...currentQuestion}
                  />
                </View>
              </View>
            )}
          </>
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
            onPressContinue={() => {
              nextQuestion();
              setResult(undefined);
            }}
            percentage={accCorrectLetters / (accCorrectLetters + accIncorrectLetters)}
          />
        )}
        {isExiting && <ExitModal onClose={() => setIsExiting(false)} />}
      </>
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  progress: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 8,
  },
  currentQuestion: {
    position: 'relative',
    height: '100%',
    flexDirection: 'column',
  },
});

export default QuestionTemplate;
