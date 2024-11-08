import { MotiView } from 'moti';
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import ListeningText from '~/assets/images/listening-text.svg';
import Listening from '~/assets/images/listening.svg';
import ReadingText from '~/assets/images/reading-text.svg';
import Reading from '~/assets/images/reading.svg';
import SpeakingText from '~/assets/images/speaking-text.svg';
import Speaking from '~/assets/images/speaking.svg';
import WritingText from '~/assets/images/writing-text.svg';
import Writing from '~/assets/images/writing.svg';
import { SkillEnum } from '~/lib/enums';

import { PopupLesson } from './PopupLesson';

type RegionProps = {
  name: SkillEnum;
  selected: boolean | null;
  onSelect: () => void;
};

const regionMapping: Record<SkillEnum, React.FC<SvgProps>> = {
  reading: Reading,
  listening: Listening,
  speaking: Speaking,
  writing: Writing,
};

const textMapping: Record<SkillEnum, React.FC<SvgProps>> = {
  reading: ReadingText,
  listening: ListeningText,
  speaking: SpeakingText,
  writing: WritingText,
};

const createRegionStyles = (top: number, horizontal: number, isLeft: boolean, padding?: number) => ({
  top: 28 * top + (padding ?? 0),
  [isLeft ? 'left' : 'right']: 14 * horizontal + (padding ?? 0),
});

const regionStyle: Record<SkillEnum, ReturnType<typeof createRegionStyles>> = {
  reading: createRegionStyles(6, 10, true),
  listening: createRegionStyles(2, 8, false),
  speaking: createRegionStyles(8, -9, true),
  writing: createRegionStyles(9, -12, false),
};

const regionTextStyle: Record<SkillEnum, ReturnType<typeof createRegionStyles>> = {
  reading: createRegionStyles(6, 6, true),
  listening: createRegionStyles(6, 5, false),
  speaking: createRegionStyles(7, 10, true, 7),
  writing: createRegionStyles(10, 6, true, 12),
};

const regionPopupStyleSmall: Record<SkillEnum, ReturnType<typeof createRegionStyles>> = {
  reading: createRegionStyles(6, -9, false, 18),
  listening: createRegionStyles(6, -12, false, 4),
  speaking: createRegionStyles(7, -13, true, 20),
  writing: createRegionStyles(10, -3, false, 24),
};

const ActionSelectRegion = ({ region: Region }: { region: React.FC<SvgProps> }) => {
  return <Region />;
};

const ActionSelectRegionText = ({ region: RegionText }: { region: React.FC<SvgProps> }) => {
  return <RegionText />;
};

export const Region = ({ name, selected, onSelect }: RegionProps) => {
  return (
    <>
      <View style={[styles.baseRegion, regionStyle[name]]}>
        <Pressable onPress={onSelect}>
          <ActionSelectRegion region={regionMapping[name]} />

          <View style={[styles.baseText, regionTextStyle[name]]}>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: !selected ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <ActionSelectRegionText region={textMapping[name]} />
            </MotiView>
          </View>
        </Pressable>
      </View>
      <View style={[styles.basePopup, regionStyle[name]]}>
        {selected && (
          <View style={[styles.baseText, regionPopupStyleSmall[name]]}>
            <View>
              <PopupLesson skill={name} />
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  baseRegion: {
    height: 0,
    position: 'absolute',
    transform: [{ scale: 0.9 }],
  },
  baseText: {
    position: 'absolute',
    alignSelf: 'center',
  },
  basePopup: {
    zIndex: 999,
    transform: [{ scale: 0.9 }],
  },
});
