import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LucideMoveRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.onboardingContainer}>
        <Onboarding />
      </View>
      <NavigationBar noBar={true} title={t('on_boarding.title')} style={styles.navigationBar}>
        <Text style={styles.description}>{t('on_boarding.description')}</Text>
      </NavigationBar>
      <View style={styles.buttonContainer}>
        <Button style={styles.getStartButton} onPress={handleGetStart}>
          <Text style={styles.getStartButtonText}>{t('on_boarding.get_start')}</Text>
          <LucideMoveRight color='white' />
        </Button>
        <Button style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>{t('on_boarding.skip')}</Text>
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
    alignItems: 'center',
  },
  onboardingContainer: {
    height: 444,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navigationBar: {
    width: '100%',
  },
  description: {
    ...Styles.fontSize.body,
    ...Styles.color.supportingText,
  },
  buttonContainer: {
    width: '100%',
    gap: 8,
    paddingHorizontal: 16,
  },
  getStartButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  getStartButtonText: {
    ...Styles.fontSize.body,
    color: 'white',
  },
  skipButton: {
    backgroundColor: 'white',
  },
  skipButtonText: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
    ...Styles.color.neutral[300],
  },
});

export default OnBoarding;
