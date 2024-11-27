import { router } from 'expo-router';
import { Trans, useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { useBuyShopItem, useUseInventoryItem } from '~/hooks/react-query/useItem';
import { useToast } from '~/hooks/useToast';
import { useRewardStore } from '~/hooks/zustand/useRewardStore';
import { useShopStore } from '~/hooks/zustand/useShopStore';
import { RandomGiftTypeEnum } from '~/lib/enums';
import { IBucket, IReward } from '~/lib/types';

import { Button } from '../ui/Button';

export const ShopModal = () => {
  const { t } = useTranslation('item');
  const toast = useToast();
  const buyItem = useBuyShopItem();
  const useItem = useUseInventoryItem();
  const { isModalVisible, modalContent, isAffordable, closeModal, onContinue } = useShopStore();
  const { setReward, setState } = useRewardStore();

  const { id, name, image, amount, type } = modalContent;

  const handleBuyItem = () => {
    if (isAffordable) {
      buyItem.mutate(
        { id, quantity: amount },
        {
          onSuccess: () =>
            toast.show({
              type: 'success',
              text1: t('shop.buy_success', { quantity: amount, name: t(`shop.items.${name}.name`) }),
              text1Style: { ...Styles.color.green[500] },
            }),
        }
      );
    } else {
      toast.show({
        type: 'error',
        text1: t('shop.buy_error', { quantity: amount, name: t(`shop.items.${name}.name`) }),
        text1Style: { ...Styles.color.red[500] },
      });
    }
    closeModal();
  };

  const handleUseItem = () => {
    useItem.mutate(id || '', {
      onSuccess: (response) => {
        if ('message' in response) {
          toast.show({
            type: 'info',
            text1: t('inventory.notSupport'),
          });
        } else {
          if ('value' in response) {
            setReward(response);
          } else {
            setReward({
              type: RandomGiftTypeEnum.ITEM,
              value: {
                name,
                image: {
                  url: image,
                } as IBucket,
              },
            } as IReward);
            setState('activate');
          }
          router.push('/rewards');
        }
      },
      onSettled: closeModal,
    });
  };

  return (
    <Modal animationType='slide' transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.textContainer}>
          {image && <Image source={{ uri: image }} height={120} style={{ width: '100%', objectFit: 'contain' }} />}
          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            {type === 'use' && (
              <Text>
                {t('shop.use_modal.amount', {
                  amount,
                  name: t(`shop.items.${name}.name`),
                })}
              </Text>
            )}
            <Text style={styles.body}>
              <Trans
                i18nKey={t(`shop.${type}_modal.description`, {
                  name: t(`shop.items.${name}.name`),
                  quantity: type === 'buy' ? amount : 1,
                  description: t(`shop.items.${name}.description`),
                })}
                components={{ color: <Text style={{ ...Styles.color.orange[500] }} /> }}
              />
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.continueButton}
            size='lg'
            onPress={() => onContinue(type === 'buy' ? handleBuyItem : handleUseItem)}
            disabled={useItem.isPending}>
            <Text style={styles.buttonText}>{t(`shop.${type}_modal.${type}_now`)}</Text>
          </Button>
          <Button variant='ghost' size='lg' onPress={closeModal}>
            <Text style={[styles.buttonText, styles.exitButtonText]}>{t(`shop.${type}_modal.no_thank`)}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',

    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 32,
    padding: 16,
    ...Styles.backgroundColor.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 40,
  },
  textContainer: {
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
