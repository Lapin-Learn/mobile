import { MotiView } from 'moti';
import { Pressable, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import Listening from '~/assets/images/listening.svg';
import ListeningText from '~/assets/images/listening-text.svg';
import Reading from '~/assets/images/reading.svg';
import ReadingText from '~/assets/images/reading-text.svg';
import Speaking from '~/assets/images/speaking.svg';
import SpeakingText from '~/assets/images/speaking-text.svg';
import Writing from '~/assets/images/writing.svg';
import WritingText from '~/assets/images/writing-text.svg';
import { SkillEnum } from '~/lib/enums';
import { cn } from '~/lib/utils';

import { PopupLesson } from '../PopupLesson';
import { RegionProps } from './type';

export function ActionSelectRegion({ region: Region }: { region: React.FC<SvgProps> }) {
  return <Region />;
}

export function ActionSelectRegionText({ region: RegionText }: { region: React.FC<SvgProps> }) {
  return <RegionText />;
}

export function Region({ name, selected, onSelect }: RegionProps) {
  const handlePress = () => {
    if (selected) {
      //   reset();
    }

    onSelect();
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

  const regionClassName: Record<SkillEnum, string> = {
    reading: 'top-56 right-18',
    listening: 'top-14 left-16',
    speaking: 'top-64 left-28',
    writing: 'top-80 right-24',
  };

  const regionTextClassName: Record<SkillEnum, string> = {
    reading: 'top-44 left-20',
    listening: 'top-48 right-16',
    speaking: 'top-60 left-36',
    writing: 'top-80 left-24 mt-2',
  };

  const regionPopupClassNameLarge: Record<SkillEnum, string> = {
    reading: 'top-52 right-14 mt-4',
    listening: 'top-14 left-18 mt-2',
    speaking: 'top-64 left-1 mt-2',
    writing: 'top-80 right-22 mt-4',
  };

  const regionPopupClassNameSmall: Record<SkillEnum, string> = {
    reading: 'top-44 -left-60 mt-2',
    listening: 'top-48 -left-28',
    speaking: 'top-60 -left-24',
    writing: 'top-80 -right-16 mt-2',
  };

  return (
    <>
      <View className={cn('absolute flex h-0 w-0 scale-90 items-center justify-center', regionClassName[name])}>
        <Pressable onPress={handlePress}>
          <ActionSelectRegion region={regionMapping[name]} />
          <View className={cn('absolute z-50', regionTextClassName[name])}>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: !selected ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <ActionSelectRegionText region={textMapping[name]} />
            </MotiView>
          </View>
        </Pressable>
      </View>
      {selected && (
        <View
          className={cn('absolute z-50 flex scale-90 items-center justify-center', regionPopupClassNameLarge[name])}>
          <View className={cn('absolute', regionPopupClassNameSmall[name])}>
            <PopupLesson skill={name} />
          </View>
        </View>
      )}
    </>
  );
}