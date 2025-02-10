import { router, useLocalSearchParams } from 'expo-router';
import { LucidePlay } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import LessonCard from '~/components/molecules/LessonCard';
import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { Text as UIText } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useListLessons, useQuestionTypes } from '~/hooks/react-query/useDailyLesson';
import { useDailyLessonStore } from '~/hooks/zustand';
import { bottomButtonToScreen } from '~/lib/constants/padding';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { ILesson, IQuestionType } from '~/lib/types';
import { formatLearningDuration } from '~/lib/utils';

const QuestionTypeScreen = () => {
  const { exerciseId, questionTypeId } = useLocalSearchParams<{ exerciseId: SkillEnum; questionTypeId: string }>();
  const { data: questionTypes } = useQuestionTypes({ skill: exerciseId });
  const { setCurrentQuestionType } = useDailyLessonStore();
  const currentQuestionType = questionTypes?.find(
    (questionType: IQuestionType) => questionType.id === Number(questionTypeId)
  );

  const { bandScore } = currentQuestionType?.progress || { bandScore: 'pre_ielts' };
  const { data: lessons, isLoading: lessonsLoading } = useListLessons({ questionTypeId });
  const { t } = useTranslation('translation');

  const ref = useRef<PagerView>(null);
  const [currentLesson, setCurrentLesson] = useState<ILesson | undefined>(
    lessons?.lessons.find((l) => l.isCurrent) || lessons?.lessons[0]
  );

  useEffect(() => {
    const lesson = lessons?.lessons.find((l) => l.isCurrent) || lessons?.lessons[0];
    setCurrentLesson(lesson);
    ref.current?.setPage((lesson?.order || 1) - 1);
  }, [lessons]);

  useEffect(() => {
    setCurrentQuestionType(currentQuestionType ?? null);
  }, [currentQuestionType, setCurrentQuestionType]);

  if (lessonsLoading) {
    return <Loading />;
  }

  const handlePrev = () => {
    ref.current?.setPage((currentLesson?.order || 1) - 2);
  };

  const handleNext = () => {
    ref.current?.setPage(currentLesson?.order || 1);
  };

  const isComingSoon = [BandScoreEnum.BAND_6_0, BandScoreEnum.BAND_6_5, BandScoreEnum.BAND_7_0].includes(
    bandScore as BandScoreEnum
  );

  return (
    <SafeAreaView>
      <NavigationBar
        headerLeftShown
        headerRightShown
        // TODO: allow go to other bands
        // onHeaderRightPress={() =>
        //   BandScoreSelect({
        //     value: bandScore,
        //   })
        // }
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={{ uri: currentQuestionType?.image?.url ?? 'https://via.placeholder.com/40' }}
          />
          <View style={styles.headerTextContainer}>
            <Text
              style={[
                { textAlign: 'center' },
                Styles.font.bold,
                Styles.fontSize['title-1'],
                Styles.color.neutral[900],
              ]}>
              {currentQuestionType?.name}
            </Text>
            <Text style={[Styles.font.medium, Styles.fontSize['title-4'], Styles.color.supportingText]}>
              {bandScore === BandScoreEnum.PRE_IELTS ? BandScoreEnum.PRE_IELTS.toUpperCase() : `Band ${bandScore}`}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              {t('questionType.totalLearnedTime')} {formatLearningDuration(lessons?.totalLearningDuration || 0)}
            </Text>
          </View>
          {currentQuestionType?.instructions?.length ? (
            <Button
              variant='secondary'
              size='lg'
              style={styles.button}
              onPress={() => {
                router.push(`/exercise/${exerciseId}/${questionTypeId}/instruction`);
              }}>
              <LucidePlay size={12} color='black' fill='black' />
              <Text style={[Styles.font.semibold, Styles.fontSize.subhead]}>{t('questionType.theoryPractice')}</Text>
            </Button>
          ) : null}
        </View>
        <View style={styles.pagerViewContainer}>
          {isComingSoon ? (
            <Text style={{ ...Styles.fontSize['title-1'], ...Styles.font.semibold }}>
              {t('questionType.comingSoon')}
            </Text>
          ) : lessons?.lessons.length ? (
            <PagerView
              style={styles.pagerView}
              initialPage={(currentLesson?.order || 1) - 1}
              pageMargin={16}
              orientation='horizontal'
              onPageSelected={(e) => setCurrentLesson(lessons.lessons[e.nativeEvent.position])}
              ref={ref}>
              {lessons.lessons.map((lesson) => (
                <View style={styles.pagerViewItem} key={lesson.id}>
                  <LessonCard
                    t={t}
                    item={lesson}
                    lessons={lessons.lessons}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                  />
                </View>
              ))}
            </PagerView>
          ) : (
            <Text>{t('questionType.noLessonFound')}</Text>
          )}
        </View>

        <View style={styles.footer}>
          {!isComingSoon && (
            <Button
              size='lg'
              onPress={() => router.push(`/lesson/${currentLesson?.id || 0}`)}
              disabled={!currentLesson}>
              <UIText>{t('questionType.practiceBtn')}</UIText>
            </Button>
          )}
          {/* TODO: Jump to next band */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    gap: 20,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
  headerTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 'auto',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  pagerViewContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerView: {
    flex: 1,
    height: '100%',
  },
  pagerViewItem: {
    justifyContent: 'center',
  },
  footer: {
    marginBottom: bottomButtonToScreen,
    gap: 16,
  },
});

export default QuestionTypeScreen;
