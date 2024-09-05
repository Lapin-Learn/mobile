import { MotiView } from 'moti';
import { TouchableOpacity, View } from 'react-native';

import Writing from '~/assets/images/writing.svg';
import WritingText from '~/assets/images/writing-text.svg';
import { Skill } from '~/types';

import { PopupLesson } from './PopupLession';

export function WritingRegion({
  currentSkill,
  setCurrentSkill,
  reset,
}: {
  currentSkill: Skill | null;
  setCurrentSkill: () => void;
  reset: () => void;
}) {
  const handlePress = () => {
    if (currentSkill === Skill.WRITING) {
      reset();
      return;
    }
    setCurrentSkill();
  };

  return (
    <>
      <View className='w-0 h-0 absolute flex justify-center items-center scale-90 top-80 right-20'>
        <TouchableOpacity onPress={handlePress}>
          <Writing />
          <View className='z-50 absolute top-80 left-24 mt-2'>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: currentSkill !== Skill.WRITING ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <WritingText />
            </MotiView>
          </View>
        </TouchableOpacity>
      </View>
      <View className={`z-50 absolute flex justify-center items-center scale-90 top-80 right-20`}>
        {currentSkill === Skill.WRITING ? (
          <View className={`absolute top-80 -right-16 mt-2`}>
            <PopupLesson skill={currentSkill} />
          </View>
        ) : null}
      </View>
    </>
  );
}
