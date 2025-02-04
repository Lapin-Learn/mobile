import { Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import Carrot from '~/assets/images/carrot.svg';
import IconCheckmarkCircle from '~/assets/images/checkmark-circle.svg';
import { default as MissionIcon } from '~/components/icons/MissionIcon';
import { ProfileSection as Section } from '~/components/molecules/profile/ProfileSection';
import { Progress } from '~/components/ui/Progress';
import Styles from '~/constants/GlobalStyles';
import { MissionStatusEnum } from '~/lib/enums';
import { convertMissionNameCategory, formatRemainingToDateTime } from '~/lib/utils';

import { MissionProps, MissionSectionProps } from './type';

export const MissionSection = ({ title, timeRemaining, missions }: MissionSectionProps) => {
  const { t } = useTranslation('mission');
  return (
    <Section style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      {title && timeRemaining && (
        <Section.Title
          label={title}
          style={{
            alignItems: 'flex-end',
          }}
          textStyle={sectionStyles.label}>
          <View style={missionSectionStyles.remainingTime}>
            <Clock size={16} color='#F17D53' />
            <Text style={missionSectionStyles.remainingTimeText}>
              {t('time_remaining', { time: formatRemainingToDateTime(timeRemaining) })}
            </Text>
          </View>
        </Section.Title>
      )}
      <Section.Group style={{ backgroundColor: 'white', paddingVertical: 0 }}>
        <ListMissions data={missions} />
      </Section.Group>
    </Section>
  );
};

const missionSectionStyles = StyleSheet.create({
  remainingTime: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  remainingTimeText: {
    ...Styles.font.medium,
    ...Styles.fontSize['caption-1'],
    ...Styles.color.orange[400],
  },
});

const sectionStyles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-3'],
    ...Styles.color.dark,
  },
  group: {
    borderWidth: 1,
    ...Styles.borderColor.neutral[100],
    overflow: 'hidden',
    borderRadius: 8,
    padding: 16,
  },
});

export const ListMissions = ({ data = [] }: { data?: MissionProps[] }) => {
  return data.map((item, index) => {
    const progressValue = item.current / item.quantity;
    const isLastItem = index === data.length - 1;

    return (
      <View
        key={index}
        style={[item.status === MissionStatusEnum.COMPLETED ? { ...Styles.backgroundColor.yellow[100] } : null]}>
        <Section.Item style={styles.root}>
          <View style={styles.missionInfo}>
            <View style={{ height: 48, width: 48 }}>
              {item.interval === 'daily' ? (
                <MissionIcon.Daily code={item.name} />
              ) : (
                <MissionIcon.Monthly code={item.name} />
              )}
            </View>
            <Section.Title
              label={convertMissionNameCategory(item)}
              textStyle={{ ...Styles.fontSize.subhead }}
              style={{
                flex: 1,
                flexGrow: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 4,
              }}>
              <View style={{ width: '100%' }}>
                <Progress
                  style={{
                    height: 16,
                  }}
                  indicatorStyle={{
                    ...Styles.backgroundColor.orange[400],
                  }}
                  value={progressValue * 100}
                  label={`${item.current}/${item.quantity}`}
                />
              </View>
            </Section.Title>
          </View>
          <View style={styles.reward}>
            {item.status === MissionStatusEnum.RECEIVED ? (
              <IconCheckmarkCircle width={24} height={24} />
            ) : (
              <>
                <Text style={styles.rewardText}>+{item.rewards}</Text>
                <Carrot width={18} height={18} />
              </>
            )}
          </View>
        </Section.Item>
        {!isLastItem && <View style={{ borderTopWidth: 1, ...Styles.borderColor.neutral[100] }} />}
      </View>
    );
  });
};

const styles = StyleSheet.create({
  root: {
    flex: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  missionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    flexGrow: 1,
    width: '100%',
  },
  rewardText: {
    ...Styles.font.semibold,
    ...Styles.fontSize.subhead,
    ...Styles.color.dark,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    width: 56,
  },
});
