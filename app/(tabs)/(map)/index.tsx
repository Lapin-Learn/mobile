import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconCarrot from '~/assets/images/carrot.svg';
import IconRank from '~/assets/images/rank.svg';
import IconStreak from '~/assets/images/streak.svg';
import { Modal } from '~/components/molecules/Modal';
import { Region } from '~/components/molecules/region/Region';
import { SkillEnum } from '~/lib/enums';

export default function Index() {
  // const { status } = useAuth();

  // useEffect(() => {
  //   hydrate();
  // }, []);

  // if (status === 'idle') {
  //   // Display loading indicator while hydrating the auth state
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size={50} color='blue' />
  //     </View>
  //   );
  // }

  // if (status === 'signOut') {
  //   return <Redirect href='/auth/sign-in' />;
  // }

  return (
    <SafeAreaView>
      <View className='z-50 m-4 flex flex-row items-center justify-center gap-10'>
        <View className='flex flex-row items-center justify-center'>
          <IconStreak width={32} height={32} />
          <Text className='title-4 font-bold text-orange-500'>1234</Text>
        </View>
        <View className='flex flex-row items-center justify-center'>
          <IconCarrot width={32} height={32} />
          <Text className='title-4 font-bold text-orange-400'>500</Text>
        </View>
        <IconRank width={48} height={48} />
      </View>
      <Map />
      <Modal>
        <Text>This is modal content to require a user profile update</Text>
      </Modal>
    </SafeAreaView>
  );
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
