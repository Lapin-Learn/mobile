import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Badge, badgeTextVariants } from '~/components/ui/Badge';
import { Progress } from '~/components/ui/Progress';
import { useQuestionTypes } from '~/hooks/react-query/useDailyLesson';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/interfaces';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function QuestionTypeCard({ name, progress, imageId }: Pick<IQuestionType, 'name' | 'progress' | 'imageId'>) {
  const { bandScore, totalLearningXP } = progress || { bandScore: 'pre_ielts', totalLearningXP: 0 };
  const { t } = useTranslation('translation');

  return (
    <View className='flex flex-col gap-2 rounded-lg border-2 border-neutral-100 p-4'>
      <View className='flex w-full flex-row items-start justify-between'>
        <Image className='h-12 w-12 rounded-full' source={{ uri: 'https://via.placeholder.com/48' }} />
        <Badge>
          <Text className={badgeTextVariants({ variant: 'default' })}>
            {bandScore === BandScoreEnum.PRE_IELTS ? BandScoreEnum.PRE_IELTS.toUpperCase() : `Band ${bandScore}`}
          </Text>
        </Badge>
      </View>
      <Text className='text-title-2 font-semibold text-neutral-900'>{name}</Text>
      <View className='flex gap-2'>
        <View className='flex flex-row justify-between'>
          <Text className='text-subhead font-medium text-supporting-text'>{t('questionTypes.experience')}</Text>
          <Text className='text-subhead font-medium text-supporting-text'>
            {t('questionTypes.xp')} {totalLearningXP}/500
          </Text>
        </View>
        <Progress value={totalLearningXP / 500} />
      </View>
    </View>
  );
}

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { data: questionTypes, isLoading: questionTypesLoading } = useQuestionTypes({ skill: exerciseId as SkillEnum });

  if (questionTypesLoading) {
    return <Loading />;
  }

  if (!questionTypes || questionTypes.length === 0) {
    return (
      <SafeAreaView>
        <View className='h-full items-center justify-center'>
          <Text>No question types found for this skill</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className='flex flex-col'>
        <NavigationBar title={capitalizeFirstLetter(exerciseId)} headerLeftShown />
        <View className='px-4 py-6'>
          <FlatList
            data={questionTypes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  router.push(`/exercise/${exerciseId}/${item.id}`);
                }}>
                <QuestionTypeCard name={item.name} progress={item.progress} imageId={item.imageId} />
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='h-5' />}
            className='mb-80'
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
