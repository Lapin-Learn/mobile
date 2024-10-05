import { router, useLocalSearchParams } from 'expo-router';
import { BookMarked, ChevronLeft, ChevronRight, LucidePlay } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { Text as UIText } from '~/components/ui/Text';
import { useListLessons, useQuestionTypes } from '~/hooks/react-query/useDailyLesson';
import { useDailyLesson } from '~/hooks/zustand';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/interfaces';
import { formatLearningDuration } from '~/lib/utils';

export default function QuestionType() {
  const { exerciseId, questionTypeId } = useLocalSearchParams<{ exerciseId: string; questionTypeId: string }>();
  const setCurrentQuestionType = useDailyLesson((state) => state.setCurrentQuestionType);
  const { data: questionTypes } = useQuestionTypes({ skill: exerciseId as SkillEnum });
  const currentQuestionType = questionTypes?.find(
    (questionType: IQuestionType) => questionType.id === Number(questionTypeId)
  );
  setCurrentQuestionType(currentQuestionType ? currentQuestionType : ({} as IQuestionType));
  const { bandScore } = currentQuestionType?.progress || { bandScore: 'pre_ielts' };
  const { data: lessons, isLoading: lessonsLoading } = useListLessons({ questionTypeId });
  const width = Dimensions.get('window').width - 32;
  const ref = useRef<ICarouselInstance>(null);
  const { t } = useTranslation('translation');
  const currentLesson = lessons?.lessons?.find((lesson) => lesson.isCurrent) || lessons?.lessons?.[0];

  const [curLessonId, setCurLessonId] = useState<number>(currentLesson?.id || 0);

  useEffect(() => {
    if (currentLesson) {
      setCurLessonId(currentLesson.id);
    }
  }, [currentLesson]);

  if (lessonsLoading) {
    return <Loading />;
  }

  const handlePrev = () => {
    ref.current?.prev();
  };

  const handleNext = () => {
    ref.current?.next();
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
            <Text className='text-title-1 font-bold text-neutral-900'>{currentQuestionType?.name}</Text>
            <Text className='text-title-4 font-medium text-supporting-text'>
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
            <Text className='text-subhead font-semibold'>{t('questionType.theoryPractice')}</Text>
          </Button>
        </View>
        <View className='flex-grow flex-row items-center'>
          {lessons && lessons.lessons.length > 0 ? (
            <Carousel
              loop={false}
              ref={ref}
              width={width}
              height={210}
              data={lessons?.lessons || []}
              defaultIndex={(currentLesson && currentLesson.order - 1) || 0}
              onSnapToItem={(index) => setCurLessonId(lessons?.lessons[index].id)}
              renderItem={({ item }) => (
                <View className='w-full gap-2 rounded-lg bg-neutral-50 px-4 py-5'>
                  <View className='flex-row justify-between'>
                    <TouchableOpacity onPress={handlePrev} disabled={item.order === 1}>
                      <ChevronLeft size={24} color={item.order === 1 ? 'grey' : 'black'} />
                    </TouchableOpacity>
                    <Text className='text-title-3 font-semibold'>
                      {item.order}/{lessons.lessons.length}
                    </Text>
                    <TouchableOpacity onPress={handleNext} disabled={item.order === lessons.lessons.length}>
                      <ChevronRight size={24} color={item.order === lessons.lessons.length ? 'grey' : 'black'} />
                    </TouchableOpacity>
                  </View>
                  <View className='gap-2'>
                    <View className='h-12 w-12 rounded-full bg-white p-3'>
                      <BookMarked size={24} color='black' />
                    </View>
                    <Text className='z-10 text-title-1 font-bold'>{item.name}</Text>
                  </View>
                  <View className='flex-row items-center gap-4'>
                    <View className='h-2 flex-grow'>
                      <Progress value={(item.xp / 50) * 100} />
                    </View>
                    <Text className='text-subhead font-medium text-supporting-text'>
                      {t('questionTypes.xp')} {item.xp}/50
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text>Không có bài học nào</Text>
          )}
        </View>
        <View className='mb-18 gap-4'>
          <Button size='lg' onPress={() => router.push(`/lesson/${curLessonId}`)} disabled={!curLessonId}>
            <UIText>{t('questionType.practiceBtn')}</UIText>
          </Button>
          <Button size='lg' className='bg-neutral-900'>
            <UIText>{t('questionType.jumpNextBtn')}</UIText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
