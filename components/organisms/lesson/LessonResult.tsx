import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import CarrotIcon from '~/assets/images/carrot.svg';
import TimerIcon from '~/assets/images/clock.svg';
import FlashIcon from '~/assets/images/flash.svg';
import { CustomModal } from '~/components/molecules/Modal';
import { ProgressCircle } from '~/components/molecules/ProgressCircle';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useMilestoneStore } from '~/hooks/zustand/useMilestoneStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { convertSecondsToMinutes } from '~/lib/utils';

export type LessonResultProps = {
  percent: number;
  exp: number;
  carrot: number;
  timer: number;
  [key: string]: number;
};

const { font, fontSize } = Styles;

const tickerComponents: Record<string, { Component: React.FC<SvgProps>; label: string }> = {
  exp: { Component: FlashIcon, label: 'after.Experience' },
  carrot: { Component: CarrotIcon, label: 'after.Carrot' },
  timer: { Component: TimerIcon, label: 'after.Timer' },
};

export const LessonResult = ({ data }: { data: LessonResultProps }) => {
  const { milestones } = useMilestoneStore();

  const { t } = useTranslation('lesson');

  const [isModalVisible, setIsModalVisible] = useState(true);

  const randomEncourage = Math.random() * Number(t('after.encourages.length'));

  const handleNextMilestone = () => {
    setIsModalVisible(false);
    if (milestones.length) {
      router.replace('/milestones');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fullSize}>
        <LinearGradient start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} colors={['#3A8A7D', '#20534D']}>
          <View style={styles.fullSize}>
            <LottieView
              style={{ ...StyleSheet.absoluteFillObject }}
              resizeMode='cover'
              source={require('~/assets/images/confetti.json')}
              autoPlay
              loop={true}
            />
          </View>
        </LinearGradient>
        <CustomModal position='bottom' visible={isModalVisible}>
          <View style={styles.modalContent}>
            <View style={styles.progressContainer}>
              <ProgressCircle size={160} progress={data.percent as number} showsText />
              <Text style={StyleSheet.flatten([font.bold, fontSize['title-2']])}>
                {t(`after.encourages.${Math.floor(randomEncourage)}`)}
              </Text>
            </View>
            <View style={styles.tickerContainer}>
              <View style={styles.tickerRow}>
                {Object.keys(tickerComponents).map((key) => {
                  const { Component, label } = tickerComponents[key];
                  return (
                    <View key={key} style={styles.tickerItem}>
                      <Text>{t(label)}</Text>
                      <View style={styles.tickerItemContent}>
                        <Component width={24} height={24} />
                        <View>
                          <Text style={StyleSheet.flatten([font.bold, fontSize['title-2']])}>
                            {key === 'timer' ? convertSecondsToMinutes(data[key] as number) : (data[key] as number)}
                            &nbsp;
                            <Text style={StyleSheet.flatten([font.medium, fontSize['title-4']])}>
                              {key === 'exp' ? 'xp' : ''}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <Button onPress={handleNextMilestone}>
                <Text style={GLOBAL_STYLES.textButton}>{t('after.receive-reward')}</Text>
              </Button>
            </View>
          </View>
        </CustomModal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 56,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#f9f7f7',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 60,
  },
  progressContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  tickerContainer: {
    width: '100%',
    gap: 24,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  tickerItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    backgroundColor: '#efefef',
    padding: 12,
  },
  tickerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
