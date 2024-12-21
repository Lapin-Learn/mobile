import { router } from 'expo-router';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';

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

const ActionSelectRegion = ({ region }: { region: any }) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          width: '100%',
          resizeMode: 'cover',
        }}
        source={region}
      />
    </View>
  );
};

export const Region = ({ name }: RegionProps) => {
  const height = useWindowDimensions().height;
  const handleExercise = () => {
    return router.push(`/exercise/${name}`);
  };
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        ...Styles.backgroundColor.neutral[50],
      }}>
      <Pressable onPress={handleExercise} style={{ width: '100%' }}>
        <ActionSelectRegion region={regionMapping[name]} />

        <View style={{ padding: (height % 8) + 8 }}>
          <Text style={{ ...Styles.font.semibold, ...Styles.fontSize['title-3'], ...Styles.color.black }}>
            {capitalizeFirstLetter(name)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
