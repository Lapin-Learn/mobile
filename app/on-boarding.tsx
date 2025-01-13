import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LucideMoveRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import Onboarding from '~/assets/images/on-boarding.svg';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { FIRST_LAUNCH } from '~/services';

const OnBoarding = () => {
  const { t } = useTranslation();
  const handleSkip = async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH, 'false');
    router.push('/auth/sign-in');
  };

  const handleGetStart = async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH, 'false');
    router.push('/auth/sign-up');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.onboardingContainer, styles.widthFull]}>
        <Onboarding style={{ ...StyleSheet.absoluteFillObject }} />
      </View>
      <NavigationBar noBar={true} title={t('on_boarding.title')} style={styles.widthFull}>
        <Text style={styles.description}>{t('on_boarding.description')}</Text>
      </NavigationBar>
      <View style={[styles.buttonContainer, styles.widthFull]}>
        <Button size='lg' style={styles.getStartButton} onPress={handleGetStart}>
          <Text style={[{ ...Styles.color.white }, styles.buttonText]}>{t('on_boarding.get_start')}</Text>
          <LucideMoveRight color='white' />
        </Button>
        <Button size='lg' style={{ ...Styles.backgroundColor.white }} onPress={handleSkip}>
          <Text style={[{ ...Styles.color.neutral[300] }, styles.buttonText]}>{t('on_boarding.skip')}</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  onboardingContainer: {
    height: Dimensions.get('window').height * 0.5,
    alignItems: 'center',
  },
  widthFull: {
    width: '100%',
  },
  description: {
    ...Styles.fontSize.body,
    ...Styles.color.supportingText,
  },
  buttonContainer: {
    gap: 8,
    paddingHorizontal: 16,
  },
  getStartButton: {
    flexDirection: 'row',
    gap: 4,
  },
  buttonText: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
  },
});

export default OnBoarding;
