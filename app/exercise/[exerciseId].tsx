import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import { SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/interfaces';
import { getQuestionTypes } from '~/services/daily-lesson';

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: SkillEnum }>();
  const [questionTypes, setQuestionTypes] = useState<IQuestionType[]>([]);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      const data = await getQuestionTypes({ skill: exerciseId as SkillEnum });
      setQuestionTypes(data);
    };
    fetchQuestionTypes();
  }, [exerciseId]);
  return (
    <SafeAreaView>
      <NavigationBar
        headerTitle={exerciseId.toString().slice(0, 1).toUpperCase() + exerciseId.slice(1)}
        headerLeftShown={true}
      />
      {questionTypes.length === 0 ? (
        <Text>No questions</Text>
      ) : (
        questionTypes.map((questionType: IQuestionType) => (
          <View key={`${questionType.skill}-${questionType.id}`} className='mb-2 w-full flex-col justify-center'>
            <Text className='text-center'>Image ID: {questionType.imageId}</Text>
            <Text className='text-center'>Name: {questionType.name}</Text>
            <Text className='text-center'>Lessons: {questionType.lessons}</Text>
          </View>
        ))
      )}
    </SafeAreaView>
  );
}
