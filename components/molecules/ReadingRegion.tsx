import { MotiView } from 'moti';
import { TouchableOpacity, View } from 'react-native';

import Reading from '~/assets/images/reading.svg';
import ReadingText from '~/assets/images/reading-text.svg';
import { SkillEnum } from '~/enums';

import { PopupLesson } from './PopupLession';

export function ReadingRegion({
  currentSkill,
  setCurrentSkill,
  reset,
}: {
  currentSkill: SkillEnum | null;
  setCurrentSkill: () => void;
  reset: () => void;
}) {
  const handlePress = () => {
    if (currentSkill === SkillEnum.READING) {
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
              animate={{ opacity: currentSkill !== SkillEnum.READING ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <ReadingText />
            </MotiView>
          </View>
        </TouchableOpacity>
      </View>
      <View className={`z-50 absolute flex justify-center items-center scale-90 top-52 right-12 mt-2 mr-2`}>
        {currentSkill === SkillEnum.READING ? (
          <View className={`absolute top-44 -left-60 mt-2`}>
            <PopupLesson skill={currentSkill} />
          </View>
        ) : null}
      </View>
    </>
  );
}
