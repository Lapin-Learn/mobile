import { X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import RankIcon from '~/components/icons/RankIcon';
import PlatformView from '~/components/templates/PlatformView';
import Styles from '~/constants/GlobalStyles';
import { rankLevelMappings } from '~/lib/constants/labelMappings';
import { bottomScreenGap } from '~/lib/constants/padding';
import { RankEnum } from '~/lib/enums';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type XpTrackBarProps = {
  level?: number;
  currentXp?: number;
  levelXp?: number;
  rank?: RankEnum;
};

const XpTrackBar = ({ level = 1, currentXp = 0, levelXp = 100, rank = RankEnum.BRONZE }: XpTrackBarProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('milestone');

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Pressable style={styles.root} onPress={() => setOpen(true)}>
        <View style={StyleSheet.flatten([styles.root, { gap: 6 }])}>
          <RankIcon name={rank} {...Styles.iconSize.base} />
          <View style={{ width: 120 }}>
            <View
              style={StyleSheet.flatten([styles.root, { alignItems: 'flex-end', justifyContent: 'space-between' }])}>
              <Text style={trackBarStyles.textLevel}>Lv. {level}</Text>
              <Text style={trackBarStyles.textXp}>
                {formatNumber(currentXp)}/{formatNumber(levelXp)}
              </Text>
            </View>
            <View style={trackBarStyles.trackBar}>
              <View
                style={[
                  trackBarStyles.trackBarProgress,
                  { width: `${currentXp > levelXp ? 100 : (currentXp / levelXp) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </Pressable>
      <Modal animationType='slide' transparent={true} visible={open} onRequestClose={handleClose}>
        <View style={trackBarStyles.modal}>
          <PlatformView>
            <View
              style={{
                paddingHorizontal: 16,
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
              }}>
              <View
                style={StyleSheet.flatten([trackBarStyles.root, trackBarStyles.column, { gap: 40, height: '100%' }])}>
                <View style={trackBarStyles.column}>
                  <View style={StyleSheet.flatten([trackBarStyles.column, { gap: 12 }])}>
                    <RankIcon name={rank} height={80} width={80} />
                    <Text style={trackBarStyles.title}>
                      {t('rank.title')} {t(`rank.${rank}`)}
                    </Text>
                  </View>
                  <View>
                    <View
                      style={StyleSheet.flatten([
                        trackBarStyles.rowCenter,
                        { alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
                      ])}>
                      <Text style={trackBarStyles.textLevel}>
                        {t('list.level', {
                          ns: 'common',
                          level,
                        })}
                      </Text>
                      <Text style={trackBarStyles.textXp}>
                        {formatNumber(currentXp)}/{formatNumber(levelXp)}
                      </Text>
                    </View>
                    <View
                      style={StyleSheet.flatten([
                        trackBarStyles.trackBar,
                        { height: 12, maxWidth: '100%', width: 280 },
                      ])}>
                      <View
                        style={StyleSheet.flatten([
                          trackBarStyles.trackBarProgress,
                          { width: `${currentXp > levelXp ? 100 : (currentXp / levelXp) * 100}%` },
                          { height: 12 },
                        ])}
                      />
                    </View>
                  </View>
                </View>
                <View style={trackBarStyles.column}>
                  <Text style={[trackBarStyles.text, { marginBottom: 12 }]}>{t('rank.encouragement')}</Text>
                  {Object.values(RankEnum).map((rank) => (
                    <View
                      key={rank}
                      style={[trackBarStyles.rowCenter, { justifyContent: 'space-between', width: '100%' }]}>
                      <View style={[trackBarStyles.rowCenter, { gap: 8 }]}>
                        <RankIcon name={rank} />
                        <Text style={trackBarStyles.text}>
                          {t('rank.title')} {t(`rank.${rank}`)}
                        </Text>
                      </View>
                      <Text style={[trackBarStyles.text, { width: 120 }]}>
                        {t('list.level', {
                          ns: 'common',
                          level: rankLevelMappings[rank],
                        })}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <Pressable style={trackBarStyles.closeButton} onPress={handleClose}>
              <X color='gray' />
            </Pressable>
          </PlatformView>
        </View>
      </Modal>
    </>
  );
};

const trackBarStyles = StyleSheet.create({
  textLevel: {
    ...Styles.fontSize.subhead,
    ...Styles.font.semibold,
    ...Styles.color.blue[700],
  },
  textXp: {
    ...Styles.fontSize['caption-2'],
    ...Styles.font.normal,
    ...Styles.color.blue[700],
  },
  trackBar: {
    height: 6,
    borderRadius: 999,
    ...Styles.backgroundColor.neutral[50],
  },
  trackBarProgress: {
    height: 6,
    borderRadius: 999,
    ...Styles.backgroundColor.blue[400],
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    ...Styles.backgroundColor.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 44,
    paddingBottom: bottomScreenGap,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  title: {
    ...Styles.fontSize['title-3'],
    ...Styles.font.semibold,
  },
  text: {
    ...Styles.fontSize.callout,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default XpTrackBar;
