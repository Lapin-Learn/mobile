import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import IconCheckmarkCircle from '~/assets/images/checkmark-circle.svg';
import IconCrossCircle from '~/assets/images/cross-circle.svg';
import { CustomModal } from '~/components/molecules/Modal';
import Styles from '~/constants/GlobalStyles';
import { GLOBAL_STYLES } from '~/lib/constants';

import { Button } from '../../ui/Button';

export type AnswerModalProps = {
  type: 'correct' | 'incorrect';
  correctAnswers?: string[] | null;
  onPressContinue: () => void;
};

const AnswerModal = ({ type, correctAnswers, onPressContinue }: AnswerModalProps) => {
  const [randomEncourage, setRandomEncourage] = useState<number>(0);
  const [showModal, setShowModal] = useState(true);
  const { t } = useTranslation('question');

  useEffect(() => {
    const randomValue =
      type === 'correct'
        ? Math.random() * Number(t('general.correct.length'))
        : Math.random() * Number(t('general.incorrect.length'));
    setRandomEncourage(randomValue);
  }, [type]);

  // Ensure modal is shown when navigating back to the page
  useFocusEffect(
    useCallback(() => {
      if (!showModal) {
        setShowModal(true);
      }
    }, [showModal])
  );

  return (
    <CustomModal visible={showModal} onRequestClose={onPressContinue} position='bottom'>
      <View
        style={StyleSheet.flatten([
          styles.root,
          type === 'correct' ? Styles.backgroundColor.green[50] : Styles.backgroundColor.red[50],
        ])}>
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            {type === 'correct' ? (
              <IconCheckmarkCircle width={24} height={24} />
            ) : (
              <IconCrossCircle width={24} height={24} />
            )}
            <Text
              style={StyleSheet.flatten([
                styles.title,
                type === 'correct' ? styles.correctTitle : styles.incorrectTitle,
              ])}>
              {t(`general.${type}.${Math.floor(randomEncourage)}`)}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              // Close modal and navigate to explanation page
              if (setShowModal) setShowModal(false);
              router.push('/lesson/explanation');
            }}>
            <Text
              style={[
                { textDecorationLine: 'underline' },
                Styles.font.normal,
                Styles.fontSize.subhead,
                type === 'correct' ? Styles.color.green[700] : Styles.color.red[700],
              ]}>
              {t('general.explanation')}
            </Text>
          </Pressable>
        </View>
        {type === 'incorrect' && correctAnswers && correctAnswers.length > 0 && (
          <View>
            <Text style={styles.correctAnswers}>{t('general.correctAnswer')}</Text>
            {correctAnswers?.map((answer, index) => (
              <Text key={index} style={styles.correctAnswers}>
                {`\u2022 ${answer}`}
              </Text>
            ))}
          </View>
        )}
        <Button
          style={type === 'correct' ? Styles.backgroundColor.green[500] : Styles.backgroundColor.red[500]}
          onPress={onPressContinue}>
          <Text style={GLOBAL_STYLES.textButton}>{t('general.continue')}</Text>
        </Button>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-2'],
  },
  correctTitle: {
    ...Styles.color.green[900],
  },
  incorrectTitle: {
    ...Styles.color.red[900],
  },
  correctAnswers: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
  },
});

export default AnswerModal;
