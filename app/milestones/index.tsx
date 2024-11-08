import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { MissionMilestone } from '~/components/molecules/milestone/MissionMilestone';
import { NewMilestone } from '~/components/molecules/milestone/NewMilestone';
import { StreakMilestone } from '~/components/molecules/milestone/StreakMilestone';
import { MilestoneProps } from '~/components/molecules/milestone/type';
import { useMissionReward } from '~/hooks/react-query/useMission';
import { useMilestoneStore } from '~/hooks/zustand/useMilestoneStore';
import { MilestonesEnum } from '~/lib/enums';

const MilestonesMap: {
  [key in MilestonesEnum]: (props: MilestoneProps) => JSX.Element;
} = {
  daily_streak: StreakMilestone,
  level_up: NewMilestone,
  rank_up: NewMilestone,
  band_score_question_type_up: NewMilestone,
  mission_completed: MissionMilestone,
};

const Milestones = () => {
  const { milestones } = useMilestoneStore();
  const missionRewardMutation = useMissionReward();

  const [currentMilestone, setCurrentMilestone] = useState(0);

  useEffect(() => {}, [currentMilestone]);

  const sortedMilestones = milestones.sort((a, b) => {
    return Object.values(MilestonesEnum).indexOf(a.type || '') - Object.values(MilestonesEnum).indexOf(b.type || '');
  });
  const Milestone = MilestonesMap[sortedMilestones[currentMilestone].type];

  const handleNextMilestone = () => {
    if (sortedMilestones[currentMilestone].type === 'mission_completed') {
      missionRewardMutation.mutate();
    }
    if (currentMilestone < sortedMilestones.length - 1) {
      setCurrentMilestone((prev) => prev + 1);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    return () => {
      if (sortedMilestones[currentMilestone].type === 'mission_completed') {
        missionRewardMutation.mutate();
      }
    };
  }, [currentMilestone, missionRewardMutation, sortedMilestones]);

  return <Milestone current={sortedMilestones[currentMilestone]} handleNextMilestone={handleNextMilestone} />;
};

export default Milestones;
