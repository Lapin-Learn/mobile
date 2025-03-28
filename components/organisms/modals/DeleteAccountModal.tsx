import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { StyleProps } from 'react-native-reanimated';

import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';

type DeleteAccountModalContentProps = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  confirmAction?: () => void;
  cancelAction?: () => void;
  confirmStyle?: StyleProps;
  cancelStyle?: StyleProps;
};

type DeleteAccountModalProps = {
  visible: boolean;
  type?: 'tooltip' | 'confirmation';
  setVisible: (visible: boolean) => void;
};

/**
 * DeleteAccountModal component displays a modal with a title, message, and optional confirm and cancel buttons.
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
 * @param content.confirmStyle - Optional style for the confirm button.
 * @param content.actionStyle - Optional style for the action buttons.
 *
 * @returns A modal component with the specified content and actions.
 */
export const DeleteAccountModal = ({
  visible,
  setVisible,
  type = 'confirmation',
  content,
}: DeleteAccountModalProps & { content: DeleteAccountModalContentProps }) => {
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
                {content.cancelAction && (
                  <Button
                    style={StyleSheet.flatten([styles.button, styles.cancelButton])}
                    onPress={content.cancelAction}
                    disabled={content.isPending}>
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                      {content.cancelText ? content.cancelText : t('update.cancel')}
                    </Text>
                  </Button>
                )}
                {content.confirmAction && (
                  <Button
                    style={[
                      styles.button,
                      {
                        borderWidth: 1,
                        ...Styles.borderColor.red[200],
                      },
                    ]}
                    onPress={content.confirmAction}
                    disabled={content.isPending}>
                    <Text style={styles.buttonText}>
                      {content.confirmText ? content.confirmText : t('update.button')}
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
    ...Styles.font.semibold,
    ...Styles.fontSize['title-4'],
    marginBottom: 10,
  },
  message: {
    ...Styles.fontSize.subhead,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...Styles.font.semibold,
    ...Styles.fontSize.callout,
    ...Styles.color.red[500],
  },
  cancelButtonText: {
    ...Styles.color.black,
  },
});
