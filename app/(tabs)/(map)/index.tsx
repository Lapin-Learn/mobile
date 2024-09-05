import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconCarrot from '~/assets/images/carrot.svg';
import IconRank from '~/assets/images/rank.svg';
import IconStreak from '~/assets/images/streak.svg';
import { ListeningRegion } from '~/components/molecules/ListeningRegion';
import { ReadingRegion } from '~/components/molecules/ReadingRegion';
import { SpeakingRegion } from '~/components/molecules/SpeakingRegion';
import { WritingRegion } from '~/components/molecules/WritingRegion';
import { Button } from '~/components/ui/button';
import { SkillEnum } from '~/enums';

export default function Index() {
  return (
    <SafeAreaView>
      <View className='flex flex-row items-center justify-center gap-10 m-4 z-50'>
        <View className='flex flex-row items-center justify-center'>
          <IconStreak width={32} height={32} />
          <Text className='text-orange-500 title-4 font-bold'>1234</Text>
        </View>
        <View className='flex flex-row items-center justify-center'>
          <IconCarrot width={32} height={32} />
          <Text className='text-orange-400 title-4 font-bold'>500</Text>
        </View>
        <IconRank width={32} height={32} />
      </View>
      <Map />
      <View className='flex flex-col items-center justify-center'>
        <Button variant='outline' className='w-[50%]' onPress={() => router.push('daily-lesson')}>
          <Text>Go to Lesson</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function Map() {
  const [currentSkill, setCurrentSkill] = useState<SkillEnum | null>(null);
  const getTranslate = (skill: SkillEnum | null) => {
    switch (skill) {
      case SkillEnum.READING:
        return { x: -75, y: -25 };
      case SkillEnum.LISTENING:
        return { x: 100, y: 100 };
      case SkillEnum.SPEAKING:
        return { x: 150, y: -75 };
      case SkillEnum.WRITING:
        return { x: -25, y: -250 };
      default:
        return { x: 0, y: 0 };
    }
  };

  return (
    <Pressable className='h-full' onPress={() => setCurrentSkill(null)}>
      <MotiView
        className='flex justify-center items-center -mt-5'
        from={{
          translateX: 0,
          translateY: 0,
        }}
        animate={{
          translateX: getTranslate(currentSkill).x,
          translateY: getTranslate(currentSkill).y,
        }}
        transition={{ type: 'timing', duration: 1000 }}>
        <SpeakingRegion
          currentSkill={currentSkill}
          setCurrentSkill={() => setCurrentSkill(SkillEnum.SPEAKING)}
          reset={() => setCurrentSkill(null)}
        />
        <WritingRegion
          currentSkill={currentSkill}
          setCurrentSkill={() => setCurrentSkill(SkillEnum.WRITING)}
          reset={() => setCurrentSkill(null)}
        />
        <ReadingRegion
          currentSkill={currentSkill}
          setCurrentSkill={() => setCurrentSkill(SkillEnum.READING)}
          reset={() => setCurrentSkill(null)}
        />
        <ListeningRegion
          currentSkill={currentSkill}
          setCurrentSkill={() => setCurrentSkill(SkillEnum.LISTENING)}
          reset={() => setCurrentSkill(null)}
        />
      </MotiView>
    </Pressable>
  );
}
