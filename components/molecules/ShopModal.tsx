import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import { Button } from '../ui/Button';

type ShopModalProps = {
  name: string;
  quantity: string;
  image: string;
  onClose: () => void;
  onContinue: () => void;
};

export const ShopModal = ({ name, quantity, image, onClose, onContinue }: ShopModalProps) => {
  const [showModal, setShowModal] = useState(true);
  const { t } = useTranslation('item');

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <Modal animationType='fade' transparent={true} visible={showModal} onRequestClose={handleClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.textContainer}>
            <Image source={{ uri: image }} height={120} style={{ width: '100%', objectFit: 'contain' }} />
            <Text style={styles.body}>
              {/* {t('buy_modal.description', {
                name: t(`items.${name}.name`),
                quantity,
                description: t(`items.${name}.description`),
              })} */}
              <Trans
                i18nKey={t('shop.buy_modal.description', {
                  name: t(`shop.items.${name}.name`),
                  quantity,
                  description: t(`shop.items.${name}.description`),
                })}
                components={{ color: <Text style={{ ...Styles.color.orange[500] }} /> }}
              />
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={styles.continueButton} size='lg' onPress={onContinue}>
              <Text style={styles.buttonText}>{t('shop.buy_modal.buy_now')}</Text>
            </Button>
            <Button variant='ghost' size='lg' onPress={handleClose}>
              <Text style={[styles.buttonText, styles.exitButtonText]}>{t('shop.buy_modal.no_thank')}</Text>
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 32,
    padding: 16,
    ...Styles.backgroundColor.white,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  title: {
    ...Styles.fontSize['title-2'],
    ...Styles.font.semibold,
    textAlign: 'center',
  },
  body: {
    ...Styles.fontSize['title-3'],
    ...Styles.font.semibold,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  continueButton: {
    ...Styles.backgroundColor.orange[500],
  },
  buttonText: {
    ...Styles.fontSize.body,
    ...Styles.font.semibold,
    ...Styles.color.white,
  },
  exitButtonText: {
    ...Styles.color.orange[500],
  },
});
