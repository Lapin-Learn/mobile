import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconCarrot from '~/assets/images/carrot.svg';
import IconStreak from '~/assets/images/streak.svg';
import { Loading } from '~/components/molecules/Loading';
import { Region } from '~/components/molecules/region/Region';
import XpTrackBar from '~/components/molecules/XpTrackBar';
import { useUserProfile } from '~/hooks/react-query/useUser';
import { RankEnum, SkillEnum } from '~/lib/enums';
import { formatNumber } from '~/lib/utils';

export default function Index() {
  const { data, isFetching, error } = useUserProfile();

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  if (data) {
    const { learnerProfile } = data;
    const { streak, carrots, level, xp, rank } = learnerProfile;

    return (
      <SafeAreaView>
        <View className='z-50 m-4 flex flex-row items-center justify-center gap-6'>
          <View className='flex flex-row items-center justify-center gap-[2px]'>
            <IconStreak width={28} height={28} />
            <Text className='title-4 font-bold text-orange-500'>{streak?.current}</Text>
          </View>
          <View className='flex flex-row items-center justify-center gap-[2px]'>
            <IconCarrot width={28} height={28} />
            <Text className='title-4 font-bold text-orange-400'>{formatNumber(carrots ?? 0)}</Text>
          </View>
          <View className='flex flex-row items-center justify-center'>
            <XpTrackBar
              level={level.id || 1}
              currentXp={xp || 0}
              levelXp={level.xp || 100}
              rank={(rank as RankEnum) || RankEnum.BRONZE}
            />
          </View>
        </View>
        <Map />
      </SafeAreaView>
    );
  } else {
    return null;
  }
}

function Map() {
  const [currentSkill, setCurrentSkill] = useState<SkillEnum | null>(null);

  const handleSelectRegion = (skill: SkillEnum | null) => {
    if (currentSkill === skill) {
      setCurrentSkill(null);
    } else {
      setCurrentSkill(skill);
    }
  };

  const translateMap: Record<SkillEnum | 'null', { x: number; y: number }> = {
    reading: { x: -75, y: -25 },
    listening: { x: 100, y: 100 },
    speaking: { x: 150, y: -75 },
    writing: { x: -25, y: -250 },
    null: { x: 0, y: 0 },
  };

  return (
    <Pressable className='h-full' onPress={() => setCurrentSkill(null)}>
      <MotiView
        className='-mt-5 flex items-center justify-center'
        from={{
          translateX: 0,
          translateY: 0,
        }}
        animate={{
          translateX: translateMap[currentSkill ?? 'null'].x,
          translateY: translateMap[currentSkill ?? 'null'].y,
        }}
        transition={{ type: 'timing', duration: 1000 }}>
        {Object.values(SkillEnum).map((skill) => {
          return (
            <Region
              key={skill}
              name={skill}
              selected={currentSkill === skill}
              onSelect={() => handleSelectRegion(skill)}
            />
          );
        })}
      </MotiView>
    </Pressable>
  );
}
