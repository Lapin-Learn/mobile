import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

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
  type?: 'tooltip' | 'confirmation';
  setVisible: (visible: boolean) => void;
};

/**
 * ConfirmationModal component displays a modal with a title, message, and optional confirm and cancel buttons.
 *
 * @param visible - Boolean indicating whether the modal is visible.
 * @param setVisible - Function to set the visibility of the modal.
 * @param type - Type of the modal, either 'tooltip' or 'confirmation'.
 * @param content - Object containing the content of the modal.
 * @param content.title - Title text of the modal.
 * @param content.message - Message text of the modal.
 * @param content.confirmText - Optional text for the confirm button.
 * @param content.cancelText - Optional text for the cancel button.
 * @param content.confirmAction - Optional function to be called when the confirm button is pressed.
 * @param content.cancelAction - Optional function to be called when the cancel button is pressed.
 *
 * @returns A modal component with the specified content and actions.
 */
export const ConfirmationModal = ({
  visible,
  setVisible,
  type = 'confirmation',
  content,
}: ConfirmationModalProps & { content: ConfirmationModalContentProps }) => {
  const { t } = useTranslation();

  const TouchableView = ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => {
    return type === 'tooltip' ? (
      <TouchableWithoutFeedback onPress={onPress}>{children}</TouchableWithoutFeedback>
    ) : (
      <>{children}</>
    );
  };

  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
      <TouchableView onPress={() => setVisible(false)}>
        <View style={styles.overlay}>
          <TouchableView onPress={() => {}}>
            <View style={styles.container}>
              <Text style={styles.title}>{content.title}</Text>
              <Text style={styles.message}>{content.message}</Text>
              <View style={styles.buttonContainer}>
                {content.confirmAction && (
                  <Button style={styles.button} onPress={content.confirmAction}>
                    <Text style={styles.buttonText}>
                      {content.confirmText ? content.confirmText : t('update.button')}
                    </Text>
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
          </TouchableView>
        </View>
      </TouchableView>
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
