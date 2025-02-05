import { router } from 'expo-router';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';

import Listening from '~/assets/images/map/listening.jpg';
import Reading from '~/assets/images/map/reading.jpg';
import Speaking from '~/assets/images/map/speaking.jpg';
import Writing from '~/assets/images/map/writing.jpg';
import Styles from '~/constants/GlobalStyles';
import { SkillEnum } from '~/lib/enums';
import { capitalizeFirstLetter } from '~/lib/utils';

type RegionProps = {
  name: SkillEnum;
};

const regionMapping: Record<SkillEnum, any> = {
  reading: Reading,
  listening: Listening,
  speaking: Speaking,
  writing: Writing,
};

export const Region = ({ name }: RegionProps) => {
  const height = Dimensions.get('window').height;
  const handleExercise = () => {
    return router.push(`/exercise/${name}`);
  };
  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        ...Styles.backgroundColor.neutral[50],
      }}>
      <Pressable onPress={handleExercise}>
        <Image resizeMode='cover' source={regionMapping[name]} />

        <View style={{ padding: (height % 8) + 8 }}>
          <Text style={{ ...Styles.font.semibold, ...Styles.fontSize['title-3'], ...Styles.color.black }}>
            {capitalizeFirstLetter(name)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
