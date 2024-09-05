import { MotiView } from 'moti';
import { TouchableOpacity, View } from 'react-native';

import Listening from '~/assets/images/listening.svg';
import ListeningText from '~/assets/images/listening-text.svg';
import { Skill } from '~/types';

import { PopupLesson } from './PopupLession';

export function ListeningRegion({
  currentSkill,
  setCurrentSkill,
  reset,
}: {
  currentSkill: Skill | null;
  setCurrentSkill: () => void;
  reset: () => void;
}) {
  const handlePress = () => {
    if (currentSkill === Skill.LISTENING) {
      reset();

      return;
    }
    setCurrentSkill();
  };

  return (
    <>
      <View className={`w-0 h-0 absolute flex justify-center items-center scale-90 top-14 left-16`}>
        <TouchableOpacity onPress={handlePress}>
          <Listening />

          <View className={`z-50 absolute top-48 right-16`}>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: currentSkill !== Skill.LISTENING ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <ListeningText />
            </MotiView>
          </View>
        </TouchableOpacity>
      </View>
      <View className={`z-50 absolute flex justify-center items-center scale-90 top-14 left-16`}>
        {currentSkill === Skill.LISTENING ? (
          <View className={`absolute top-48 -left-28`}>
            <PopupLesson skill={currentSkill} />
          </View>
        ) : null}
      </View>
    </>
  );
}
