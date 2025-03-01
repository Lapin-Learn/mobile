import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { ExitModal } from '~/components/organisms/modals/ExitModal';
import { Progress } from '~/components/ui/Progress';
import { useDailyLessonQuestionStore, useSpeakingStore } from '~/hooks/zustand';
import { bottomScreenGap } from '~/lib/constants/padding';
import { ContentTypeEnum } from '~/lib/enums';
import { getAccurateIPA } from '~/lib/utils';

import PlatformView from '../../templates/PlatformView';
import QuestionCard from '../question-card';
import AnswerInput from './answer-input/AnswerInput';
import Speaking from './answer-input/speaking/Speaking';
import AnswerModal from './AnswerModal';

const QuestionTemplate = () => {
  const {
    nextQuestion,
    answerQuestion,
    state: { totalQuestion, learnerAnswers, currentQuestion, currentQuestionIndex },
  } = useDailyLessonQuestionStore();
  const { result, setResult } = useSpeakingStore();
  const [isExiting, setIsExiting] = useState(false);

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

  const showAnswerModal = learnerAnswers[currentQuestionIndex].totalOfQuestions > 0;
  const { accCorrectLetters, accIncorrectLetters } = getAccurateIPA(result?.correct_letters ?? []);

  return (
    <PlatformView
      style={{ paddingBottom: currentQuestion?.contentType === ContentTypeEnum.FILL_IN_THE_BLANK ? 24 : 0 }}>
      <View style={styles.progress}>
        <Pressable
          style={{
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleBack}>
          <LucideMoveLeft color='black' />
        </Pressable>
        <Progress
          value={(currentQuestionIndex / totalQuestion) * 100}
          label={`${currentQuestionIndex}/${totalQuestion}`}
          style={{ height: 16 }}
        />
        <View style={{ width: 2 }} />
      </View>
      {/* For Speaking */}
      {currentQuestion?.contentType === ContentTypeEnum.PRONUNCIATION ? (
        <Speaking onAnswer={answerQuestion} data={currentQuestion} />
      ) : (
        <>
          {currentQuestion && (
            <View style={styles.currentQuestion}>
              <QuestionCard data={currentQuestion} isPaused={showAnswerModal} />
              <View
                style={{
                  flex: 1,
                  flexGrow: 1,
                  paddingHorizontal: 16,
                  paddingBottom: showAnswerModal ? 120 : bottomScreenGap,
                }}>
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
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  progress: {
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  currentQuestion: {
    position: 'relative',
    height: '100%',
    flexDirection: 'column',
  },
});

export default QuestionTemplate;
