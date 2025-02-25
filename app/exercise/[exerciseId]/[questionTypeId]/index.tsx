import { Href, router, useLocalSearchParams } from 'expo-router';
import { LucidePlay } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UnlockLesson from '~/assets/images/unlock-lesson.svg';
import BandScoreSelect from '~/components/molecules/BandScoreSelect';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import LessonList from '~/components/organisms/lesson-list';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useListLessons, useQuestionTypes } from '~/hooks/react-query/useDailyLesson';
import { useCurrentQuestionTypeStore } from '~/hooks/zustand';
import { GLOBAL_STYLES } from '~/lib/constants';
import { bandscoreMappings } from '~/lib/constants/labelMappings';
import { bottomButtonToScreen } from '~/lib/constants/padding';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/types';
import { formatLearningDuration } from '~/lib/utils';

const checkAvailable = (bandScore: BandScoreEnum, currentBandScore: BandScoreEnum) => {
  const bandScoreList = Object.values(BandScoreEnum);
  const currentIndex = bandScoreList.indexOf(currentBandScore);
  const targetIndex = bandScoreList.indexOf(bandScore);
  return currentIndex >= targetIndex;
};

const QuestionTypeScreen = () => {
  const { exerciseId, questionTypeId, bandScore } = useLocalSearchParams<{
    exerciseId: SkillEnum;
    questionTypeId: string;
    bandScore?: BandScoreEnum;
  }>();
  const { data: questionTypes } = useQuestionTypes({ skill: exerciseId });
  const { setCurrentQuestionType } = useCurrentQuestionTypeStore();
  const currentQuestionType = questionTypes?.find(
    (questionType: IQuestionType) => questionType.id === Number(questionTypeId)
  );

  const { bandScore: currentBandScore } = currentQuestionType?.progress ?? { bandScore: BandScoreEnum.PRE_IELTS };
  const { t } = useTranslation('translation');

  useEffect(() => {
    setCurrentQuestionType(currentQuestionType ?? null);
  }, [currentQuestionType, setCurrentQuestionType]);

  const isComingSoon = [BandScoreEnum.BAND_6_0, BandScoreEnum.BAND_6_5, BandScoreEnum.BAND_7_0].includes(
    bandScore as BandScoreEnum
  );
  const isAvailableJumpBand = useMemo(() => {
    const currentIndex = Object.values(BandScoreEnum).findIndex((b) => b === currentBandScore);
    const targetIndex = Object.values(BandScoreEnum).findIndex((b) => b === bandScore);
    return targetIndex - 1 === currentIndex;
  }, [currentBandScore, bandScore]);

  const isAvailable = checkAvailable(bandScore as BandScoreEnum, currentBandScore);

  const { data: lessons } = useListLessons({
    questionTypeId,
    bandScore: bandScore ?? currentBandScore,
    enabled: isAvailable,
  });

  return (
    <SafeAreaView>
      <NavigationBar
        headerLeftShown
        headerRightShown
        onHeaderRightPress={() =>
          BandScoreSelect({
            value: bandScore ?? currentBandScore,
          })
        }
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={{ uri: currentQuestionType?.image?.url ?? 'https://via.placeholder.com/40' }}
          />
          <View style={styles.headerTextContainer}>
            <Text
              style={[
                { textAlign: 'center' },
                Styles.font.bold,
                Styles.fontSize['title-1'],
                Styles.color.neutral[900],
              ]}>
              {currentQuestionType?.name}
            </Text>
            <Text style={[Styles.font.medium, Styles.fontSize['title-4'], Styles.color.supportingText]}>
              {bandscoreMappings[bandScore ?? currentBandScore]}
              {isAvailable && (
                <>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  {t('questionType.totalLearnedTime')} {formatLearningDuration(lessons?.totalLearningDuration ?? 0)}
                </>
              )}
            </Text>
          </View>
          {currentQuestionType?.instructions?.length && isAvailable ? (
            <Button
              variant='secondary'
              size='lg'
              style={styles.button}
              onPress={() => {
                router.push(`/exercise/${exerciseId}/${questionTypeId}/instruction`);
              }}>
              <LucidePlay size={12} color='black' fill='black' />
              <Text style={[Styles.font.semibold, Styles.fontSize.subhead]}>{t('questionType.theoryPractice')}</Text>
            </Button>
          ) : null}
        </View>
        {isComingSoon ? (
          <View style={styles.placeholderContainer}>
            <UnlockLesson width={120} height={120} />
            <Text style={styles.supportingText}>{t('questionType.comingSoon')}</Text>
          </View>
        ) : !isAvailable ? (
          <>
            <View style={styles.placeholderContainer}>
              <UnlockLesson width={120} height={120} />
              <Text style={styles.supportingText}>{t('questionType.unavailable')}</Text>
            </View>

            {isAvailableJumpBand && (
              <View style={styles.footer}>
                <Button
                  variant='black'
                  size='lg'
                  onPress={() => router.push(`/exercise/${exerciseId}/${questionTypeId}/jump-band` as Href)}>
                  <Text style={GLOBAL_STYLES.textButton}>Jump band</Text>
                </Button>
              </View>
            )}
          </>
        ) : (
          <LessonList
            questionTypeId={questionTypeId}
            bandScore={bandScore ?? currentBandScore}
            available={isAvailable}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    gap: 20,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
  headerTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 'auto',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  supportingText: { ...Styles.fontSize['title-4'], ...Styles.font.medium, textAlign: 'center', width: 300 },
  pagerViewContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  footer: {
    marginBottom: bottomButtonToScreen,
    gap: 16,
  },
});

export default QuestionTypeScreen;
