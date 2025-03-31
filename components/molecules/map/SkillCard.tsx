import { router } from 'expo-router';
import { useMemo } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

import Listening from '~/assets/images/map/listening.jpg';
import Reading from '~/assets/images/map/reading.jpg';
import Speaking from '~/assets/images/map/speaking.jpg';
import Writing from '~/assets/images/map/writing.jpg';
import Styles from '~/constants/GlobalStyles';
import { SkillEnum } from '~/lib/enums';
import { capitalizeFirstLetter } from '~/lib/utils';

type SkillCardProps = {
  name: SkillEnum;
};

const skillMapping: Record<SkillEnum, any> = {
  reading: Reading,
  listening: Listening,
  speaking: Speaking,
  writing: Writing,
};

export const SkillCard = ({ name }: SkillCardProps) => {
  const height = useMemo(() => Dimensions.get('window').height, []);
  const handleExercise = () => {
    return router.push(`/exercise/${name}`);
  };
  return (
    <TouchableOpacity
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        ...Styles.backgroundColor.neutral[50],
        width: '100%',
        flex: 1,
      }}
      onPress={handleExercise}
      activeOpacity={0.7}>
      <View style={{ width: '100%', aspectRatio: 1 }}>
        <Image resizeMethod='scale' source={skillMapping[name]} style={{ width: '100%', height: '100%' }} />
      </View>

      <View style={{ padding: (height % 8) + 8, minHeight: 20 }}>
        <Text style={{ ...Styles.font.semibold, ...Styles.fontSize['title-3'], ...Styles.color.black }}>
          {capitalizeFirstLetter(name)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
