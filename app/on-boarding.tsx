import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LucideMoveRight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import Logo from '~/assets/images/logo.svg';
import Background from '~/assets/images/on-boarding/background.svg';
import First from '~/assets/images/on-boarding/first.svg';
import Fourth from '~/assets/images/on-boarding/fourth.svg';
import Second from '~/assets/images/on-boarding/second.svg';
import Third from '~/assets/images/on-boarding/third.svg';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { FIRST_LAUNCH } from '~/services';

const onBoardingMapping: Record<number, React.FC> = {
  1: First,
  2: Second,
  3: Third,
  4: Fourth,
};

const OnBoarding = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  const handleSkip = async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH, 'false');
    router.push('/auth/sign-in');
  };

  const handleGetStart = async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH, 'false');
    router.push('/auth/sign-up');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPage < 3) {
        setCurrentPage((prev) => prev + 1);
        pagerViewRef.current?.setPage(currentPage + 1);
      } else {
        setCurrentPage(0);
        pagerViewRef.current?.setPage(0);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <PlatformView>
      <Background style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {Object.keys(onBoardingMapping).map((item) => (
          <Pressable
            key={item}
            style={[
              styles.paginator,
              currentPage === Number(item) - 1 && {
                ...Styles.backgroundColor.neutral[500],
              },
            ]}
            onPress={() => {
              setCurrentPage(Number(item) - 1);
              pagerViewRef.current?.setPage(Number(item) - 1);
            }}
          />
        ))}
      </View>
      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={currentPage}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        keyboardDismissMode='on-drag'
        orientation='horizontal'>
        {Object.keys(onBoardingMapping).map((item) => (
          <View key={item} style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            {React.createElement(onBoardingMapping[Number(item)])}
            <View style={styles.onboardingContainer}>
              <Logo />
              <Text style={styles.description}>
                <Trans
                  i18nKey={`on_boarding.title_${item}`}
                  components={{ bold: <Text style={{ ...Styles.font.bold }} /> }}
                />
              </Text>
            </View>
          </View>
        ))}
      </PagerView>
      <View style={[styles.buttonContainer, styles.widthFull]}>
        <Button style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.buttonText}>{t('on_boarding.skip')}</Text>
        </Button>
        <Button size='icon' style={styles.getStartButton} onPress={handleGetStart}>
          <LucideMoveRight color='white' size={36} />
        </Button>
      </View>
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginator: {
    width: 20,
    height: 4,
    borderRadius: 4,
    ...Styles.backgroundColor.neutral[100],
  },
  pagerView: {
    width: '100%',
    flexGrow: 1,
  },
  onboardingContainer: {
    alignItems: 'center',
    gap: 24,
  },
  widthFull: {
    width: '100%',
  },
  description: {
    ...Styles.fontSize['title-4'],
    ...Styles.color.black,
    ...Styles.font.medium,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  getStartButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  skipButton: {
    width: 'auto',
    ...Styles.backgroundColor.transparent,
  },
  buttonText: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
    ...Styles.color.neutral[900],
  },
});

export default OnBoarding;
