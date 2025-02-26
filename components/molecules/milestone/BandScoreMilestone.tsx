import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { GLOBAL_STYLES } from '~/lib/constants';

import { MilestoneProps } from './type';

export const BandScoreMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');

  const milestone = current.newValue as string;

  return (
    <PlatformView
      style={{
        justifyContent: 'space-between',
        paddingVertical: 16,
      }}>
      <View />
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <LottieView
          source={require('~/assets/images/lottie/firework.json')}
          autoPlay
          loop
          style={{
            width: 240,
            height: 240,
          }}
        />
        <Text style={styles.title}>
          {t('jump-band.congratulations', {
            ns: 'lesson',
          })}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.bandscoreBadge}>Band {milestone}</Text>
        </View>
      </View>
      <View
        style={{
          margin: 16,
          gap: 16,
        }}>
        <Button onPress={handleNextMilestone} size='lg'>
          <Text style={[{ textAlign: 'center' }, GLOBAL_STYLES.textButton]}>{t('button.next')}</Text>
        </Button>
      </View>
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    overflow: 'hidden',
    width: 120,
    ...Styles.backgroundColor.blue[100],
    marginTop: 32,
  },
  bandscoreBadge: {
    padding: 8,
    ...Styles.fontSize['title-3'],
    ...Styles.color.blue[600],
    ...Styles.font.semibold,
    width: 120,
    textAlign: 'center',
  },
  title: {
    ...Styles.fontSize['title-3'],
    ...Styles.font.semibold,
    ...Styles.color.neutral[900],
    textAlign: 'center',
    width: 300,
  },
});
