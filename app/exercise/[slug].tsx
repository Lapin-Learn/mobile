import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import { SkillEnum } from '~/enums';
import { IQuestionType } from '~/interfaces';
import { getQuestionTypes } from '~/services/daily-lesson';

export default function Exercise() {
  const { slug } = useLocalSearchParams();
  const [questionTypes, setQuestionTypes] = useState<IQuestionType[]>([]);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      const data = await getQuestionTypes({ skill: slug as SkillEnum });
      setQuestionTypes(data);
    };
    fetchQuestionTypes();
  }, [slug]);
  return (
    <SafeAreaView>
      <NavigationBar headerTitle={slug.toString().slice(0, 1).toUpperCase() + slug.slice(1)} headerLeftShown={true} />
      {questionTypes.length === 0 ? (
        <Text>No questions</Text>
      ) : (
        questionTypes.map((questionType: IQuestionType) => (
          <View key={`${questionType.skill}-${questionType.id}`} className='flex-col justify-center w-full mb-2'>
            <Text className='text-center'>Image ID: {questionType.imageId}</Text>
            <Text className='text-center'>Name: {questionType.name}</Text>
            <Text className='text-center'>Lessons: {questionType.lessons}</Text>
          </View>
        ))
      )}
    </SafeAreaView>
  );
}
