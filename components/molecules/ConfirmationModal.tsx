import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import { Button } from '../ui/Button';

type ConfirmationModalContentProps = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmAction?: () => void;
  cancelAction?: () => void;
};

type ConfirmationModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const ConfirmationModal = ({
  visible,
  setVisible,
  content,
}: ConfirmationModalProps & { content: ConfirmationModalContentProps }) => {
  const { t } = useTranslation();

  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>
          <View style={styles.buttonContainer}>
            {content.confirmAction && (
              <Button style={styles.button} onPress={content.confirmAction}>
                <Text style={styles.buttonText}>{content.confirmText ? content.confirmText : t('update.button')}</Text>
              </Button>
            )}
            {content.cancelAction && (
              <Button style={[styles.button, styles.cancelButton]} onPress={content.cancelAction}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  {content.cancelText ? content.cancelText : t('update.cancel')}
                </Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-2'],
    marginBottom: 10,
  },
  message: {
    ...Styles.fontSize.body,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#ee5d28',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-4'],
    ...Styles.color.white,
  },
  cancelButtonText: {
    ...Styles.color.black,
  },
});
