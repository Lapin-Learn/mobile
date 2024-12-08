import { router, useLocalSearchParams } from 'expo-router';
import { BookMarked, ChevronLeft, ChevronRight, LucidePlay } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { Text as UIText } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useListLessons, useQuestionTypes } from '~/hooks/react-query/useDailyLesson';
import { useDailyLessonStore } from '~/hooks/zustand';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { ILesson, IQuestionType } from '~/lib/types';
import { formatLearningDuration } from '~/lib/utils';

type CardProps = {
  t: (key: string) => string;
  item: ILesson;
  lessons: ILesson[];
  handlePrev: () => void;
  handleNext: () => void;
};

const Card = ({ t, item, lessons, handlePrev, handleNext }: CardProps) => {
  return (
    <View style={[styles.card, Styles.backgroundColor.neutral[50]]}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={handlePrev} disabled={item.order === 1}>
          <ChevronLeft size={24} color={item.order === 1 ? 'grey' : 'black'} />
        </TouchableOpacity>
        <Text style={[Styles.font.semibold, Styles.fontSize['title-3']]}>
          {item.order}/{lessons.length}
        </Text>
        <TouchableOpacity onPress={handleNext} disabled={item.order === lessons.length}>
          <ChevronRight size={24} color={item.order === lessons.length ? 'grey' : 'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={[styles.bookmark, Styles.backgroundColor.white]}>
          <BookMarked size={24} color='black' />
        </View>
        <Text style={[styles.cardTitle, Styles.font.bold, Styles.fontSize['title-1']]}>{item.name}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Progress value={(item.xp / 50) * 100} />
        </View>
        <Text style={[Styles.font.medium, Styles.fontSize.subhead, Styles.color.supportingText]}>
          {t('questionTypes.xp')} {item.xp}/50
        </Text>
      </View>
    </View>
  );
};

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

  const isComingSoon =
    bandScore === BandScoreEnum.BAND_6_0 ||
    bandScore === BandScoreEnum.BAND_6_5 ||
    bandScore === BandScoreEnum.BAND_7_0;

  return (
    <SafeAreaView>
      <NavigationBar headerLeftShown />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={{ uri: currentQuestionType?.image?.url || 'https://via.placeholder.com/40' }}
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
              {bandScore === BandScoreEnum.PRE_IELTS ? BandScoreEnum.PRE_IELTS.toUpperCase() : `Band ${bandScore}`} |{' '}
              {t('questionType.totalLearnedTime')} {formatLearningDuration(lessons?.totalLearningDuration || 0)}
            </Text>
          </View>

          <Button
            variant='secondary'
            size='md'
            style={styles.button}
            onPress={() => {
              router.push(`/exercise/${exerciseId}/${questionTypeId}/instruction`);
            }}>
            <LucidePlay size={12} color='black' fill='black' />
            <Text style={[Styles.font.semibold, Styles.fontSize.subhead]}>{t('questionType.theoryPractice')}</Text>
          </Button>
        </View>
        <View style={styles.pagerViewContainer}>
          {isComingSoon ? (
            <Text style={{ ...Styles.fontSize['title-1'] }}>{t('questionType.comingSoon')}</Text>
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
                  <Card t={t} item={lesson} lessons={lessons.lessons} handlePrev={handlePrev} handleNext={handleNext} />
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
          {/* <Button size='lg' style={{}} ='bg-neutral-900'>
            <UIText>{t('questionType.jumpNextBtn')}</UIText>
          </Button> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    gap: 8,
  },
  bookmark: {
    width: 48,
    height: 48,
    borderRadius: 100,
    padding: 12,
  },
  cardTitle: {
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressBar: {
    height: 8,
    flexGrow: 1,
  },
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
    marginBottom: 72,
    gap: 16,
  },
});

export default QuestionTypeScreen;
