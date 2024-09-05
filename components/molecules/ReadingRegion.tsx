import { MotiView } from 'moti';
import { TouchableOpacity, View } from 'react-native';

import Reading from '~/assets/images/reading.svg';
import ReadingText from '~/assets/images/reading-text.svg';
import { Skill } from '~/types';

import { PopupLesson } from './PopupLession';

export function ReadingRegion({
  currentSkill,
  setCurrentSkill,
  reset,
}: {
  currentSkill: Skill | null;
  setCurrentSkill: () => void;
  reset: () => void;
}) {
  const handlePress = () => {
    if (currentSkill === Skill.READING) {
      reset();
      return;
    }
    setCurrentSkill();
  };

  return (
    <>
      <View className='w-0 h-0 absolute flex justify-center items-center scale-90 top-56 right-16'>
        <TouchableOpacity onPress={handlePress}>
          {/* Adjust size as necessary */}
          <Reading />
          <View className='z-50 absolute top-44 left-20'>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: currentSkill !== Skill.READING ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <ReadingText />
            </MotiView>
          </View>
        </TouchableOpacity>
      </View>
      <View className={`z-50 absolute flex justify-center items-center scale-90 top-56 right-16`}>
        {currentSkill === Skill.READING ? (
          <View className={`absolute top-44 -left-60 mt-2`}>
            <PopupLesson skill={currentSkill} />
          </View>
        ) : null}
      </View>
    </>
  );
}
