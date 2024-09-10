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
    reading: 'top-56 right-16',
    listening: 'top-14 left-16',
    speaking: 'top-64 left-28',
    writing: 'top-80 right-20',
  };

  const regionTextClassName: Record<SkillEnum, string> = {
    reading: 'top-44 left-20',
    listening: 'top-48 right-16',
    speaking: 'top-60 left-36',
    writing: 'top-80 left-24 mt-2',
  };

  const regionPopupClassNameLarge: Record<SkillEnum, string> = {
    reading: 'top-52 right-12 mt-2 mr-2',
    listening: 'top-14 left-16',
    speaking: 'top-64 left-0',
    writing: 'top-80 right-16 mt-2 mr-2',
  };

  const regionPopupClassNameSmall: Record<SkillEnum, string> = {
    reading: 'top-44 -left-60 mt-2',
    listening: 'top-48 -left-28',
    speaking: 'top-60 -left-24',
    writing: 'top-80 -right-16 mt-2',
  };

  return (
    <>
      <View className={cn('w-0 h-0 absolute flex justify-center items-center scale-90', regionClassName[name])}>
        <Pressable onPress={handlePress}>
          <ActionSelectRegion region={regionMapping[name]} />
          <View className={cn('z-50 absolute', regionTextClassName[name])}>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: !selected ? 1 : 0 }}
              transition={{ type: 'timing', duration: 500 }}>
              <ActionSelectRegionText region={textMapping[name]} />
            </MotiView>
          </View>
        </Pressable>
      </View>
      <View className={cn('z-50 absolute flex justify-center items-center scale-90', regionPopupClassNameLarge[name])}>
        {selected ? (
          <View className={cn('absolute', regionPopupClassNameSmall[name])}>
            <PopupLesson skill={name} />
          </View>
        ) : null}
      </View>
    </>
  );
}
