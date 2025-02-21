import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import Carrot from '~/assets/images/carrot.svg';
import CircleBackground from '~/assets/images/circle_drop_shadow_background.svg';
import RewardBackground from '~/assets/images/reward_background.svg';
import RadialGradientBackground from '~/components/templates/RadialGradientBackground';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useRewardStore } from '~/hooks/zustand/useRewardStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { RandomGiftTypeEnum } from '~/lib/enums';

const Rewards = () => {
  const { reward, state } = useRewardStore();
  const { t } = useTranslation('item');

  return (
    <View style={{ width: '100%' }}>
      <RadialGradientBackground colors={['#D7F7FF', '#C6F5FF']} offsets={['45.42%', '100%']}>
        <View style={{ position: 'relative', display: 'flex', height: '100%', alignItems: 'center' }}>
          <MotiView
            style={{ position: 'absolute', bottom: -128, alignItems: 'center' }}
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              loop: true,
              repeatReverse: false,
              type: 'timing',
              duration: 2000,
              easing: Easing.linear,
            }}>
            <RewardBackground />
          </MotiView>
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}>
            <View style={{ marginTop: 144 }}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                  <CircleBackground />
                  {'type' in reward && reward.type === RandomGiftTypeEnum.CARROTS ? (
                    <Carrot
                      width={140}
                      height={140}
                      style={{ position: 'absolute', transform: [{ translateY: -12 }] }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: ('type' in reward && typeof reward.value !== 'number' && reward.value.image.url) || '',
                      }}
                      style={{
                        width: 140,
                        height: 140,
                        objectFit: 'contain',
                        position: 'absolute',
                        transform: [{ translateY: -12 }],
                      }}
                    />
                  )}
                </View>
              </View>
              <View style={{ gap: 12 }}>
                <Text style={{ textAlign: 'center', ...Styles.font.semibold, ...Styles.fontSize['title-3'] }}>
                  {t(`reward.${state}`)}
                </Text>
                <Text style={{ textAlign: 'center', ...Styles.font.bold, ...Styles.fontSize['large-title'] }}>
                  {'type' in reward && reward.type === RandomGiftTypeEnum.CARROTS
                    ? `${reward.value} ${t('reward.carrot').toUpperCase()}`
                    : `${t(`shop.items.${'type' in reward && typeof reward.value !== 'number' && reward.value.name}.name`).toUpperCase()}`}
                </Text>
              </View>
            </View>
            <View>
              <Button
                onPress={() => router.back()}
                size='lg'
                style={{ ...Styles.backgroundColor.blue[500], marginBottom: 32 }}>
                <Text style={GLOBAL_STYLES.textButton}>{t('reward.button')}</Text>
              </Button>
            </View>
          </View>
        </View>
      </RadialGradientBackground>
    </View>
  );
};

export default Rewards;
