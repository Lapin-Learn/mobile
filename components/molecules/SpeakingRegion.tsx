import { MotiView } from 'moti';
import { TouchableOpacity, View } from 'react-native';

import Speaking from '~/assets/images/speaking.svg';
import SpeakingText from '~/assets/images/speaking-text.svg';
import { SkillEnum } from '~/enums';

import { PopupLesson } from './PopupLession';

export function SpeakingRegion({
  currentSkill,
  setCurrentSkill,
  reset,
}: {
  currentSkill: SkillEnum | null;
  setCurrentSkill: () => void;
  reset: () => void;
}) {
  const handlePress = () => {
    if (currentSkill === SkillEnum.SPEAKING) {
      reset();
      return;
    }
    setCurrentSkill();
  };

  return (
    <>
      <View className='w-0 h-0 absolute flex justify-center items-center scale-90 top-64 left-28'>
        <TouchableOpacity onPress={handlePress}>
          <Speaking />
          <View className={`z-50 absolute top-60 left-36`}>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: currentSkill !== SkillEnum.SPEAKING ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <SpeakingText />
            </MotiView>
          </View>
        </TouchableOpacity>
      </View>
      <View className='z-50 absolute flex justify-center items-center scale-90 top-64 left-0'>
        {currentSkill === SkillEnum.SPEAKING ? (
          <View className={`absolute top-60 -left-24`}>
            <PopupLesson skill={currentSkill} />
          </View>
        ) : null}
      </View>
    </>
  );
}
