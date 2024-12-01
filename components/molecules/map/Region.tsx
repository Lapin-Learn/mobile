import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

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
  return <Image source={region} />;
};

export const Region = ({ name }: RegionProps) => {
  const handleExercise = () => {
    return router.push(`/exercise/${name}`);
  };
  return (
    <View style={{ flex: 1 / 2, ...Styles.backgroundColor.neutral[50], borderRadius: 16, overflow: 'hidden' }}>
      <Pressable onPress={handleExercise} style={{ width: '100%' }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActionSelectRegion region={regionMapping[name]} />
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ ...Styles.font.semibold, ...Styles.fontSize['title-3'], ...Styles.color.black }}>
            {capitalizeFirstLetter(name)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
