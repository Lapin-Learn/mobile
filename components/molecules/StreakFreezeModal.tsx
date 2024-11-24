import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { useBuyShopItem, useInventory, useShop, useUseInventoryItem } from '~/hooks/react-query/useItem';
import { useStreaks } from '~/hooks/react-query/useStreak';
import { useToast } from '~/hooks/useToast';
import { useRewardStore } from '~/hooks/zustand/useRewardStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { ItemEnum } from '~/lib/enums';
import { IGameProfile, IInventory, IShop } from '~/lib/types';

import { Button } from '../ui/Button';

const isAvailable = (dates: string[]) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return (
    !dates.includes(today.toISOString()) &&
    !dates.includes(yesterday.toISOString()) &&
    dates.includes(twoDaysAgo.toISOString())
  );
};

const hasShownToday = async () => {
  const lastShown = await AsyncStorage.getItem('lastShownDate');
  const today = new Date().toISOString().split('T')[0];
  return lastShown === today;
};

const setShownToday = async () => {
  const today = new Date().toISOString().split('T')[0];
  await AsyncStorage.setItem('lastShownDate', today);
};

export const StreakFreezeModal = ({ gameProfile }: { gameProfile?: IGameProfile }) => {
  const { t } = useTranslation('item');
  const toast = useToast();
  const buyItem = useBuyShopItem();
  const useItem = useUseInventoryItem();
  const { setReward } = useRewardStore();
  const { data: streakDays } = useStreaks({});
  const [open, setOpen] = useState(false);
  const { data: shop } = useShop();
  const { data: inventory } = useInventory();
  const [item, setItem] = useState<IShop>();
  const [inventoryItem, setInventoryItem] = useState<IInventory>();
  const [type, setType] = useState<'buy' | 'use'>('buy');

  useEffect(() => {
    if (isAvailable(streakDays?.map((d) => d.date) || []) && !hasShownToday()) {
      setOpen(true);
      setShownToday();
    }
  }, [streakDays]);

  useEffect(() => {
    if (shop) {
      const streakFreeze = shop.find((item) => item.name === ItemEnum.STREAK_FREEZE);
      if (streakFreeze) setItem(streakFreeze);
    }
  }, [shop]);

  useEffect(() => {
    if (inventory) {
      const streakFreeze = inventory.find((item) => item.item.name === ItemEnum.STREAK_FREEZE);
      if (streakFreeze) {
        setInventoryItem(streakFreeze);
        if (streakFreeze.quantity > 0) setType('use');
      }
    }
  }, [inventory]);

  const handleBuyItem = () => {
    if (item)
      if ((gameProfile?.carrots || 0) >= (item.price['1'] || -1)) {
        buyItem.mutate(
          { id: item.id || '', quantity: item.price['1'] },
          {
            onSuccess: () => {
              toast.show({
                type: 'success',
                text1: t('shop.buy_success', { quantity: item.price['1'], name: t(`shop.items.STREAK_FREEZE.name`) }),
                text1Style: { ...Styles.color.green[500] },
              });
              if (type === 'use') handleUseItem();
            },
          }
        );
      } else {
        toast.show({
          type: 'error',
          text1: t('shop.buy_error', { quantity: item.price['1'], name: t(`shop.items.STREAK_FREEZE.name`) }),
          text1Style: { ...Styles.color.red[500] },
        });
      }

    setOpen(false);
  };

  const handleUseItem = () => {
    useItem.mutate(inventoryItem?.itemId || '', {
      onSuccess: (response) => {
        if ('message' in response) {
          toast.show({
            type: 'info',
            text1: t('inventory.notSupport'),
          });
        } else {
          setReward(response);
          router.push('/rewards');
        }
      },
      onSettled: () => setOpen(false),
    });
  };

  return (
    <>
      {open && <View style={GLOBAL_STYLES.modalBackground} />}
      <Modal animationType='slide' transparent={true} visible={open} onRequestClose={() => setOpen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.textContainer}>
            {item?.image.url && (
              <Image source={{ uri: item?.image.url }} height={120} style={{ width: '100%', objectFit: 'contain' }} />
            )}
            <View style={{ justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <Text>
                {t('shop.use_modal.amount', {
                  amount: inventoryItem?.quantity || 0,
                  name: t(`shop.items.STREAK_FREEZE.name`),
                })}
              </Text>
              <Text style={styles.body}>
                <Trans
                  i18nKey={t(`shop.${type}_modal.description`, {
                    name: t(`shop.items.STREAK_FREEZE.name`),
                    quantity: 1,
                    description: t(`shop.items.STREAK_FREEZE.description`),
                  })}
                  components={{ color: <Text style={{ ...Styles.color.orange[500] }} /> }}
                />
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={styles.continueButton} size='lg' onPress={handleBuyItem} disabled={useItem.isPending}>
              <Text style={styles.buttonText}>{t(`streak_freeze.${type === 'use' ? 'use' : 'buy_and_use'}`)}</Text>
            </Button>
            <Button variant='ghost' size='lg' onPress={() => setOpen(false)}>
              <Text style={[styles.buttonText, styles.exitButtonText]}>{t(`shop.buy_modal.no_thank`)}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
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
