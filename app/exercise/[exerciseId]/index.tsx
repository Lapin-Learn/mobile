import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import Speaking from '~/components/organisms/exercise/answer-input/speaking/Speaking';
import PlatformView from '~/components/templates/PlatformView';
import { Badge, badgeTextStyles } from '~/components/ui/Badge';
import { Progress } from '~/components/ui/Progress';
import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useQuestionTypes } from '~/hooks/react-query/useDailyLesson';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/types';

const { font, fontSize, color } = Styles;

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

type QuestionTypeCardProps = Pick<IQuestionType, 'name' | 'progress' | 'imageId' | 'bandScoreRequires'>;
const QuestionTypeCard = ({ name, progress, imageId, bandScoreRequires }: QuestionTypeCardProps) => {
  const { bandScore, totalLearningXP } = progress || { bandScore: 'pre_ielts', totalLearningXP: 0 };
  const curReq = bandScoreRequires.find((req) => req.bandScore === bandScore);
  const { t } = useTranslation('translation');

  return (
    <View style={card.wrapper}>
      <View style={card.container}>
        <Image style={card.image} source={{ uri: imageId || 'https://via.placeholder.com/48' }} />
        <Badge>
          <Text style={StyleSheet.flatten([badgeTextStyles.root, badgeTextStyles.default])}>
            {bandScore === BandScoreEnum.PRE_IELTS ? BandScoreEnum.PRE_IELTS.toUpperCase() : `Band ${bandScore}`}
          </Text>
        </Badge>
      </View>
      <Text style={StyleSheet.flatten([font.semibold, fontSize['title-2'], color.neutral[900]])}>{name}</Text>
      <View style={card.textWrapper}>
        <View style={card.textContainer}>
          <Text style={texts.supportingText}>{t('questionTypes.experience')}</Text>
          <Text style={texts.supportingText}>
            {t('questionTypes.xp')} {totalLearningXP}/{curReq?.requireXP}
          </Text>
        </View>
        <Progress value={(totalLearningXP / (curReq?.requireXP || 1)) * 100} />
      </View>
    </View>
  );
};

const Exercise = () => {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { data: questionTypes, isLoading: questionTypesLoading } = useQuestionTypes({ skill: exerciseId as SkillEnum });

  if (questionTypesLoading) {
    return <Loading />;
  }

  if (exerciseId === SkillEnum.SPEAKING) {
    return (
      <PlatformView>
        <Speaking />
      </PlatformView>
    );
  }

  if (!questionTypes || questionTypes.length === 0) {
    return (
      <SafeAreaView>
        <View style={containers.noContent}>
          <Text>No question types found for this skill</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.areaView}>
        <NavigationBar title={capitalizeFirstLetter(exerciseId)} headerLeftShown />
        <View style={containers.main}>
          <FlatList
            data={questionTypes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  router.push(`/exercise/${exerciseId}/${item.id}`);
                }}>
                <QuestionTypeCard
                  name={item.name}
                  progress={item.progress}
                  imageId={item.image?.url || ''}
                  bandScoreRequires={item.bandScoreRequires}
                />
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Exercise;

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
  },
  contentContainer: {
    gap: 20,
  },
});

const containers = StyleSheet.create({
  main: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flex: 1,
  },
  noContent: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const texts = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  supportingText: StyleSheet.flatten([font.medium, fontSize.subhead, color.supportingText]),
});

const card = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#cccccc',
    padding: 16,
    gap: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  textWrapper: {
    gap: 8,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
