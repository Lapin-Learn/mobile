import { router, useLocalSearchParams } from 'expo-router';
import { BookMarked, ChevronLeft, ChevronRight, LucidePlay } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { Text as UIText } from '~/components/ui/Text';
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
    <View className='w-full gap-2 rounded-lg bg-neutral-50 px-4 py-5'>
      <View className='flex-row justify-between'>
        <TouchableOpacity onPress={handlePrev} disabled={item.order === 1}>
          <ChevronLeft size={24} color={item.order === 1 ? 'grey' : 'black'} />
        </TouchableOpacity>
        <Text className='font-isemibold text-title-3'>
          {item.order}/{lessons.length}
        </Text>
        <TouchableOpacity onPress={handleNext} disabled={item.order === lessons.length}>
          <ChevronRight size={24} color={item.order === lessons.length ? 'grey' : 'black'} />
        </TouchableOpacity>
      </View>
      <View className='gap-2'>
        <View className='h-12 w-12 rounded-full bg-white p-3'>
          <BookMarked size={24} color='black' />
        </View>
        <Text className='z-10 font-ibold text-title-1'>{item.name}</Text>
      </View>
      <View className='flex-row items-center gap-4'>
        <View className='h-2 flex-grow'>
          <Progress value={(item.xp / 50) * 100} />
        </View>
        <Text className='font-imedium text-subhead text-supporting-text'>
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

  return (
    <SafeAreaView>
      <NavigationBar headerLeftShown />
      <View className='h-full justify-between px-4 pb-9'>
        <View className='flex w-full items-center gap-5'>
          <Image
            className='h-40 w-40 rounded-full'
            source={{ uri: currentQuestionType?.image?.url || 'https://via.placeholder.com/40' }}
          />
          <View className='items-center'>
            <Text className='font-ibold text-title-1 text-neutral-900'>{currentQuestionType?.name}</Text>
            <Text className='font-imedium text-title-4 text-supporting-text'>
              {bandScore === BandScoreEnum.PRE_IELTS ? BandScoreEnum.PRE_IELTS.toUpperCase() : `Band ${bandScore}`} |{' '}
              {t('questionType.totalLearnedTime')} {formatLearningDuration(lessons?.totalLearningDuration || 0)}
            </Text>
          </View>

          <Button
            variant='secondary'
            size='md'
            className='w-fit flex-row gap-2 px-4 color-neutral-900'
            onPress={() => {
              router.push(`/exercise/${exerciseId}/${questionTypeId}/instruction`);
            }}>
            <LucidePlay size={12} color='black' fill='black' />
            <Text className='font-isemibold text-subhead'>{t('questionType.theoryPractice')}</Text>
          </Button>
        </View>
        <View className='flex-grow flex-row items-center justify-center'>
          {lessons?.lessons.length ? (
            <PagerView
              style={{ flex: 1, height: 250 }}
              initialPage={(currentLesson?.order || 1) - 1}
              pageMargin={16}
              orientation='horizontal'
              onPageSelected={(e) => setCurrentLesson(lessons.lessons[e.nativeEvent.position])}
              ref={ref}>
              {lessons.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  t={t}
                  item={lesson}
                  lessons={lessons.lessons}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                />
              ))}
            </PagerView>
          ) : (
            <Text>{t('questionType.noLessonFound')}</Text>
          )}
        </View>
        <View className='mb-18 gap-4'>
          <Button size='lg' onPress={() => router.push(`/lesson/${currentLesson?.id || 0}`)} disabled={!currentLesson}>
            <UIText>{t('questionType.practiceBtn')}</UIText>
          </Button>
          <Button size='lg' className='bg-neutral-900'>
            <UIText>{t('questionType.jumpNextBtn')}</UIText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuestionTypeScreen;
