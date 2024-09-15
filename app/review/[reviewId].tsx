import { useLocalSearchParams, useNavigation } from 'expo-router';
import { LucideLock } from 'lucide-react-native';
import { useLayoutEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconPractice from '~/assets/images/tab-practice.svg';
import { Button } from '~/components/ui/Button';
import { SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/interfaces';
import { cn } from '~/lib/utils';

type CustomQuestionType = Omit<IQuestionType, 'skill'> & {
  state: 'locked' | 'unlocked';
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const questionTypes: CustomQuestionType[] = [
  {
    id: 1,
    imageId: '1234',
    name: 'Skimming',
    lessons: 5,
    state: 'unlocked',
  },
  {
    id: 2,
    imageId: '5678',
    name: 'Scanning',
    lessons: 10,
    state: 'locked',
  },
  {
    id: 3,
    imageId: '91011',
    name: 'Matching Headings',
    lessons: 15,
    state: 'locked',
  },
  {
    id: 4,
    imageId: '121314',
    name: 'Matching Features',
    lessons: 20,
    state: 'locked',
  },
  {
    id: 5,
    imageId: '151617',
    name: 'True/False/Not Given',
    lessons: 25,
    state: 'locked',
  },
  {
    id: 6,
    imageId: '181920',
    name: 'Question Type 6',
    lessons: 30,
    state: 'locked',
  },
  {
    id: 7,
    imageId: '212223',
    name: 'Question Type 7',
    lessons: 35,
    state: 'locked',
  },
  {
    id: 8,
    imageId: '242526',
    name: 'Question Type 8',
    lessons: 40,
    state: 'locked',
  },
  {
    id: 9,
    imageId: '272829',
    name: 'Question Type 9',
    lessons: 45,
    state: 'locked',
  },
  {
    id: 10,
    imageId: '303132',
    name: 'Question Type 10',
    lessons: 50,
    state: 'locked',
  },
  {
    id: 11,
    imageId: '333435',
    name: 'Question Type 11',
    lessons: 55,
    state: 'locked',
  },
  {
    id: 12,
    imageId: '363738',
    name: 'Question Type 12',
    lessons: 60,
    state: 'locked',
  },
  {
    id: 13,
    imageId: '394041',
    name: 'Question Type 13',
    lessons: 65,
    state: 'locked',
  },
  {
    id: 14,
    imageId: '424344',
    name: 'Question Type 14',
    lessons: 70,
    state: 'locked',
  },
  {
    id: 15,
    imageId: '454647',
    name: 'Question Type 15',
    lessons: 75,
    state: 'locked',
  },
  {
    id: 16,
    imageId: '484950',
    name: 'Question Type 16',
    lessons: 80,
    state: 'locked',
  },
];

export default function Review() {
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  const navigation = useNavigation();
  const [selectedQuestionType, setSelectedQuestionType] = useState<CustomQuestionType | null>(questionTypes[0]);
  const [bottomViewHeight, setBottomViewHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: capitalizeFirstLetter(reviewId as string),
    });
  }, [navigation]);

  // const { data: questionTypes, isLoading } = useQuery({
  //   queryKey: ['questionTypes', { skill: slug as SkillEnum }],
  //   queryFn: getQuestionTypes,
  // });

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (!questionTypes) {
    return (
      <SafeAreaView className='flex h-full items-center justify-center'>
        <Text>No question types found for this skill</Text>
      </SafeAreaView>
    );
  }

  const skillColorMap = {
    [SkillEnum.SPEAKING]: 'bg-purple-300',
    [SkillEnum.LISTENING]: 'bg-blue-300',
    [SkillEnum.READING]: 'bg-green-200',
    [SkillEnum.WRITING]: 'bg-yellow-300',
  };
  const bgColor = skillColorMap[reviewId as SkillEnum];
  const shadowColor = `shadow-${reviewId}-lesson`;
  const lessonCls = (state: 'locked' | 'unlocked', selected: boolean) => {
    return cn('rounded-lg w-full h-28 justify-center items-center', {
      'bg-neutral-100': state === 'locked',
      [bgColor]: state === 'unlocked',
      [shadowColor]: state === 'unlocked' && selected,
    });
  };

  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight - bottomViewHeight - 90;

  return (
    <SafeAreaView className='relative h-full w-full'>
      <View className='mt-12'>
        <FlatList
          data={questionTypes}
          renderItem={({ item }) => {
            return (
              <Pressable
                key={`${item.id}`}
                onPress={() => setSelectedQuestionType(item)}
                className='flex-1 flex-col text-wrap'>
                <View className={lessonCls(item.state, selectedQuestionType?.id === item.id)}>
                  {item.state === 'unlocked' ? (
                    <IconPractice height={56} width={56} />
                  ) : (
                    <LucideLock size={48} color='#414141' />
                  )}
                </View>
                <Text className='mt-3 text-center text-body font-semibold'>{item.name}</Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={() => (
            <View className='flex items-center justify-center'>
              <Text>No question types found for this skill</Text>
            </View>
          )}
          className='w-full px-6 pb-0'
          style={{ height: flatListHeight }}
          numColumns={3}
          key={`flatlist-${3}`}
          keyExtractor={(item) => item.id + ''}
          ItemSeparatorComponent={() => <View className='h-6' />}
          columnWrapperClassName='gap-6'
        />
      </View>

      {selectedQuestionType && (
        <View
          className='w-full flex-col gap-4 bg-orange-50 p-4 pb-8'
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setBottomViewHeight(height);
          }}>
          <View className='flex-row items-center justify-between'>
            <Text className='text-title-2 font-bold'>{selectedQuestionType.name}</Text>
            {selectedQuestionType.state !== 'locked' && (
              <Text className='text-subhead font-medium'>Lesson 1/{selectedQuestionType.lessons}</Text>
            )}
          </View>
          <View className='flex-col gap-2'>
            {selectedQuestionType.state !== 'locked' ? (
              <>
                <Button

                // onPress={handleExercise}
                >
                  <Text className='text-button text-subhead'>Learn lesson</Text>
                </Button>
                <Button
                  className='bg-orange-50 shadow-orange-700'
                  // onPress={handleReview}
                >
                  <Text className='text-button text-subhead text-orange-500'>Start game</Text>
                </Button>
              </>
            ) : (
              <Button

              // onPress={handleExercise}
              >
                <Text className='text-button text-subhead'>Unlock lesson</Text>
              </Button>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
