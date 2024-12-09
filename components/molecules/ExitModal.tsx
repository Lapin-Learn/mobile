import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import { Button } from '../ui/Button';

type ExitModalProps = {
  onClose: () => void;
};

export const ExitModal = ({ onClose }: ExitModalProps) => {
  const [showModal, setShowModal] = useState(true);
  const { t } = useTranslation('lesson');

  const handleBack = () => {
    setShowModal(false);
    router.back();
  };

  const handleContinue = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <Modal animationType='fade' transparent={true} visible={showModal} onRequestClose={handleContinue}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('quit_lesson.title')}</Text>
            <Text style={styles.body}>{t('quit_lesson.description')}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={styles.continueButton} size='lg' onPress={handleContinue}>
              <Text style={styles.buttonText}>{t('quit_lesson.continue')}</Text>
            </Button>
            <Button variant='ghost' size='lg' onPress={handleBack}>
              <Text style={[styles.buttonText, styles.exitButtonText]}>{t('quit_lesson.quit')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#00000033',
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 32,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  body: {
    fontSize: 17,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  continueButton: {
    backgroundColor: '#ee5d28',
  },
  buttonText: {
    ...Styles.font.bold,
    ...Styles.fontSize.body,
    ...Styles.color.white,
    fontSize: 17,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  exitButtonText: {
    color: '#EE4D4D',
  },
});
