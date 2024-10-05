import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { NewMilestone } from '~/components/molecules/milestone/NewMilestone';
import { StreakMilestone } from '~/components/molecules/milestone/StreakMilestone';
import { MilestoneProps } from '~/components/molecules/milestone/type';
import { useGameStore } from '~/hooks/zustand';
import { MilestonesEnum, RankEnum } from '~/lib/enums';
import { IMilestone } from '~/lib/interfaces';

const MilestonesMap: {
  [key in MilestonesEnum]: (props: MilestoneProps) => JSX.Element;
} = {
  daily_streak: StreakMilestone,
  level_up: NewMilestone,
  rank_up: NewMilestone,
};

export default function Milestones() {
  // const { resetGame, milestones } = useGameStore();

  // To test the component
  const { resetGame } = useGameStore();
  const milestones: IMilestone[] = [
    {
      type: MilestonesEnum.LEVEL_UP,
      newValue: {
        id: 3,
        xp: 300,
      },
    },
    {
      type: MilestonesEnum.RANK_UP,
      newValue: RankEnum.GOLD,
    },
    { type: MilestonesEnum.DAILY_STREAK, newValue: 3 },
  ];

  const [currentMilestone, setCurrentMilestone] = useState(0);

  useEffect(() => {}, [currentMilestone]);

  const sortedMilestones = milestones.sort((a, b) => {
    return Object.values(MilestonesEnum).indexOf(a.type || '') - Object.values(MilestonesEnum).indexOf(b.type || '');
  });
  const Milestone = MilestonesMap[sortedMilestones[currentMilestone].type];

  const handleBack = () => {
    resetGame();
    router.back();
  };
  const handleNextMilestone = () => {
    if (currentMilestone < milestones.length - 1) {
      setCurrentMilestone((prev) => prev + 1);
    } else {
      handleBack();
    }
  };

  return <Milestone current={sortedMilestones[currentMilestone]} handleNextMilestone={handleNextMilestone} />;
}
