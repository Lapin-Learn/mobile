import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { Text as UIText } from '~/components/ui/Text';
import { useListLessons } from '~/hooks/react-query/useDailyLesson';
import { bottomButtonToScreen } from '~/lib/constants/padding';
import { BandScoreEnum } from '~/lib/enums';
import { ILesson } from '~/lib/types';

import LessonCard from '../molecules/LessonCard';
import { Button } from '../ui/Button';

type LessonListProps = {
  questionTypeId: string;
  bandScore: BandScoreEnum;
  available: boolean;
};

const LessonList = ({ questionTypeId, bandScore, available }: LessonListProps) => {
  const { t } = useTranslation();
  const ref = useRef<PagerView>(null);

  const {
    data: lessons,
    isLoading: lessonsLoading,
    isError,
    error,
  } = useListLessons({
    questionTypeId,
    bandScore,
    enabled: available,
  });
  const [currentLesson, setCurrentLesson] = useState<ILesson>();
  const id = useId();

  const handlePrev = () => {
    ref.current?.setPage((currentLesson?.order || 1) - 2);
  };

  const handleNext = () => {
    ref.current?.setPage(currentLesson?.order || 1);
  };

  useEffect(() => {
    if (lessons) {
      setCurrentLesson(lessons.lessons.find((lesson) => lesson.isCurrent) ?? lessons.lessons[0]);
    }
  }, [lessons]);

  useEffect(() => {
    if (currentLesson) {
      ref.current?.setPage(currentLesson.order - 1);
    }
  }, [currentLesson]);

  if (lessonsLoading) {
    return (
      <View style={styles.pagerViewContainer}>
        <LottieView
          source={require('~/assets/images/lottie/loading_indicator.json')}
          autoPlay
          loop
          style={{ width: 32, height: 32 }}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.pagerViewContainer}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (lessons?.lessons.length === 0) return <Text>{t('questionType.noLessonFound')}</Text>;

  if (lessons) {
    return (
      <>
        <View style={styles.pagerViewContainer}>
          <PagerView
            nativeID={id}
            key={id}
            style={styles.pagerView}
            initialPage={(currentLesson?.order ?? 1) - 1}
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
        </View>
        <View style={styles.footer}>
          <Button size='lg' onPress={() => router.push(`/lesson/${currentLesson?.id || 0}`)} disabled={!currentLesson}>
            <UIText>{t('questionType.practiceBtn')}</UIText>
          </Button>
          {/* TODO: Jump to next band */}
        </View>
      </>
    );
  }

  return null;
};

export default LessonList;

const styles = StyleSheet.create({
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
