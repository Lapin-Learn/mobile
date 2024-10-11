import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { NewMilestone } from '~/components/molecules/milestone/NewMilestone';
import { StreakMilestone } from '~/components/molecules/milestone/StreakMilestone';
import { MilestoneProps } from '~/components/molecules/milestone/type';
import { useMilestone } from '~/hooks/zustand/useMilestone';
import { MilestonesEnum } from '~/lib/enums';

const MilestonesMap: {
  [key in MilestonesEnum]: (props: MilestoneProps) => JSX.Element;
} = {
  daily_streak: StreakMilestone,
  level_up: NewMilestone,
  rank_up: NewMilestone,
  band_score_question_type_up: NewMilestone,
};

export default function Milestones() {
  const { milestones } = useMilestone();

  const [currentMilestone, setCurrentMilestone] = useState(0);

  useEffect(() => {}, [currentMilestone]);

  const sortedMilestones = milestones.sort((a, b) => {
    return Object.values(MilestonesEnum).indexOf(a.type || '') - Object.values(MilestonesEnum).indexOf(b.type || '');
  });
  const Milestone = MilestonesMap[sortedMilestones[currentMilestone].type];

  const handleNextMilestone = () => {
    if (currentMilestone < sortedMilestones.length - 1) {
      setCurrentMilestone((prev) => prev + 1);
    } else {
      router.back();
    }
  };

  return <Milestone current={sortedMilestones[currentMilestone]} handleNextMilestone={handleNextMilestone} />;
}