import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Region } from '~/components/molecules/region/Region';
import TrackBar from '~/components/molecules/track-bar/TrackBar';
import { SkillEnum } from '~/lib/enums';

const Index = () => {
  return (
    <SafeAreaView>
      <TrackBar />
      <Map />
    </SafeAreaView>
  );
};

const translateMap: Record<SkillEnum | 'null', { x: number; y: number }> = {
  reading: { x: -75, y: -25 },
  listening: { x: 100, y: 100 },
  speaking: { x: 150, y: -75 },
  writing: { x: -25, y: -250 },
  null: { x: 0, y: 0 },
};

const Map = () => {
  const [currentSkill, setCurrentSkill] = useState<SkillEnum | null>(null);

  const handleSelectRegion = (skill: SkillEnum | null) => {
    if (currentSkill === skill) {
      setCurrentSkill(null);
    } else {
      setCurrentSkill(skill);
    }
  };

  return (
    <Pressable style={{ height: '100%' }} onPress={() => setCurrentSkill(null)}>
      <MotiView
        style={styles.motiView}
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
};

const styles = StyleSheet.create({
  motiView: {
    marginTop: -5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Index;
