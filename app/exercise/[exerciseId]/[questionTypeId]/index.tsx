import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { BookMarked, ChevronLeft, ChevronRight, LucidePlay } from 'lucide-react-native';
import { useRef, useState } from 'react';
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
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/interfaces';
import { formatLearningDuration } from '~/lib/utils';

export default function QuestionType() {
  const route = useRoute();
  const { exerciseId, questionTypeId } = route.params as { exerciseId: string; questionTypeId: string };
  const { data: questionTypes } = useQuestionTypes({ skill: exerciseId as SkillEnum });
  const currentQuestionType = questionTypes?.find(
    (questionType: IQuestionType) => questionType.id === Number(questionTypeId)
  );
  const { bandScore } = currentQuestionType?.progress || { bandScore: 'pre_ielts' };
  const { data: lessons, isLoading: lessonsLoading } = useListLessons({ questionTypeId });
  const width = Dimensions.get('window').width - 32;
  const ref = useRef<ICarouselInstance>(null);
  const { t } = useTranslation('translation');

  if (lessonsLoading) {
    return <Loading />;
  }

  const currentLesson = lessons?.lessons.find((lesson) => lesson.isCurrent);
  const [curLessonId, setCurLessonId] = useState<number | null>(currentLesson?.id || 0);

  const handlePrev = () => {
    ref.current?.prev();
  };

  const handleNext = () => {
    ref.current?.next();
  };

  return (
    <SafeAreaView>
      <NavigationBar headerLeftShown />
      <View className='h-full px-4 pb-9 justify-between'>
        <View className='w-full flex gap-5 items-center'>
          <Image className='h-40 w-40 rounded-full' source={{ uri: 'https://via.placeholder.com/160x160' }} />
          <View className='items-center'>
            <Text className='text-title-1 font-bold text-neutral-900'>{currentQuestionType?.name}</Text>
            <Text className='text-title-4 font-medium text-supporting-text'>
              {bandScore === BandScoreEnum.PRE_IELTS ? BandScoreEnum.PRE_IELTS.toUpperCase() : `Band ${bandScore}`} |{' '}
              {t('questionType.totalLearnedTime')} {formatLearningDuration(lessons?.totalLearningDuration || 0)}
            </Text>
          </View>
          <Button variant='secondary' size='md' className='color-neutral-900 flex-row gap-2 w-fit px-4'>
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
                <View className='bg-neutral-50 w-full px-4 py-5 rounded-lg gap-2'>
                  <View className='justify-between flex-row'>
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
                    <View className='bg-white w-12 h-12 p-3 rounded-full'>
                      <BookMarked size={24} color='black' />
                    </View>
                    <Text className='text-title-1 font-bold z-10'>{item.name}</Text>
                  </View>
                  <View className='flex-row gap-4 items-center'>
                    <View className='flex-grow'>
                      <Progress value={item.xp / 50} />
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
        <View className='gap-4 mb-18'>
          <Button size='lg' onPress={() => router.push(`/lesson/${curLessonId}`)}>
            <UIText>{t('questionType.practiceBtn')}</UIText>
          </Button>
          <Button size='lg' className='bg-neutral-900'>
            <UIText className=''>{t('questionType.jumpNextBtn')}</UIText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
