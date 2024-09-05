import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import { SkillEnum } from '~/enums';
import { IQuestionType } from '~/interfaces';
import { getQuestionTypes } from '~/services/daily-lesson';

export default function DailyLesson() {
  const [skill, setSkill] = React.useState<SkillEnum>(SkillEnum.SPEAKING);
  const [questionTypes, setQuestionTypes] = React.useState<IQuestionType[]>([]);
  React.useEffect(() => {
    const fetchQuestionTypes = async () => {
      const data = await getQuestionTypes({ skill });
      setQuestionTypes(data);
    };
    fetchQuestionTypes();
  }, [skill]);
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-2xl font-bold'>Daily Lesson</Text>
      <Text className='text-xl font-normal'>Choose a skill to practice</Text>
      <View className='flex-row justify-center w-full mb-2'>
        <Button
          variant='outline'
          className={`inline-flex p-3 rounded mx-4 min-w-24 ${skill === SkillEnum.SPEAKING ? 'bg-blue-500' : 'border-gray-300'}`}
          onPress={() => setSkill(SkillEnum.SPEAKING)}>
          <Text>Speaking</Text>
        </Button>
        <Button
          variant='outline'
          className={`inline-flex p-3 rounded mx-4 min-w-24 ${skill === SkillEnum.LISTENING ? 'bg-blue-500' : 'border-gray-300'}`}
          onPress={() => setSkill(SkillEnum.LISTENING)}>
          <Text>Listening</Text>
        </Button>
      </View>
      <View className='flex-row justify-center w-full mb-2'>
        <Button
          variant='outline'
          className={`inline-flex p-3 rounded mx-4 min-w-24 ${skill === SkillEnum.READING ? 'bg-blue-500' : 'border-gray-300'}`}
          onPress={() => setSkill(SkillEnum.READING)}>
          <Text>Reading</Text>
        </Button>
        <Button
          variant='outline'
          className={`inline-flex p-3 rounded mx-4 min-w-24 ${skill === SkillEnum.WRITING ? 'bg-blue-500' : 'border-gray-300'}`}
          onPress={() => setSkill(SkillEnum.WRITING)}>
          <Text>Writing</Text>
        </Button>
      </View>
      {questionTypes.length === 0 ? (
        <Text>No questions</Text>
      ) : (
        questionTypes.map((questionType: any) => (
          <View key={`${questionType.skill}-${questionType.id}`} className='flex-col justify-center w-full mb-2'>
            <Text className='text-center'>Image ID: {questionType.imageId}</Text>
            <Text className='text-center'>Name: {questionType.name}</Text>
            <Text className='text-center'>Lessons: {questionType.lessons}</Text>
          </View>
        ))
      )}
    </View>
  );
}
