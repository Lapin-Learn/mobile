import {
  ActionNameEnum,
  BandScoreEnum,
  GenderEnum,
  ItemEnum,
  MilestonesEnum,
  MissionCategoryEnum,
  RandomGiftTypeEnum,
  RankEnum,
  SkillEnum,
} from '../enums';

// Common types
export type IBucket = {
  id: string;
  name: string;
  owner: string;
  permission: string;
  url: string;
};
export type IImage = IBucket;
export type IAudio = IBucket;

export type IPresignedUrl = {
  id: string;
  url: string;
};

export type ILevel = {
  id: number;
  xp: number;
};

export type IStreak = {
  id: number;
  current: number;
  target: number;
  record: number;
  extended: boolean;
};

export type IStreakHistory = {
  date: string;
  actionName: ActionNameEnum.DAILY_STREAK;
};

// User types
export type IUserProfile = {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string | null;
  dob: Date | null;
  gender: GenderEnum | null;
  createdAt: string;
  learnerProfile: ILearnerProfile;
  avatarId: string | null;
  avatar?: IImage;
};

export type IAccountIdentifer = Pick<IUserProfile, 'username' | 'fullName' | 'gender' | 'dob' | 'email'>;

export type ILearnerProfile = {
  id: string;
  rank: RankEnum;
  levelId: number;
  xp: number;
  carrots: number;
  streakId: number;
  createdAt: string;
  updatedAt: string;
  level: ILevel;
  streak?: IStreak;
};

export type IGameProfile = {
  id: string;
  rank: RankEnum;
  levelId: number;
  xp: number;
  carrots: number;
  streakId: number;
  createdAt: string;
  updatedAt: string;
  level: ILevel;
  streak: IStreak;
  profileBadges: unknown[];
  profileMissions: unknown[];
  profileItems: unknown[];
  currentItems: unknown[];
};

export type IQuestionType = {
  id: number;
  name: string;
  skill: SkillEnum;
  imageId: string | null;
  bandScoreRequires: {
    bandScore: BandScoreEnum;
    requireXP: number;
  }[];
  lessons: number;
  progress: {
    bandScore: BandScoreEnum;
    totalLearningXP: number;
  };
  image: IImage | null;
  instructions: IInstruction[];
};

export type ILesson = {
  id: number;
  name: string;
  order: number;
  questionTypeId: number;
  bandScore: BandScoreEnum;
  isCurrent: boolean;
  xp: number;
};

export type IInstruction = {
  id: string;
  content: string;
  order: number;
  imageId: string;
  audioId: string;
  questionTypeId: number;
  image?: string;
  audio?: string;
};

export type ILessonResult = {
  lessonId: number;
  bonusCarrot: number;
  bonusXP: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
  milestones: IMilestone[];
};

export type IMissionMilestone = {
  current: number;
  id: string;
  mission: {
    id: string;
    quantity: number;
    quest: Omit<IMission, 'interval'>;
    type: 'daily' | 'monthly';
  };
  missionId: string;
};

export type IMilestone = {
  type: MilestonesEnum;
  newValue: ILevel | RankEnum | number | IMissionMilestone[];
};

export type IMission = {
  interval: 'daily' | 'monthly';
  name: string;
  description: string;
  rewards: number;
  current: number;
  quantity: number;
  requirements: number;
  category: MissionCategoryEnum;
};

export type IMissionReward = {
  bonusCarrot: number;
  bonusXp: number;
};

export type IShop = {
  id: string;
  name: ItemEnum;
  description: string;
  price: {
    [key: string]: number;
  };
  duration: number;
  imageId: string;
  image: IImage;
  popular: string;
  isPopular: boolean;
};

export type IItem = {
  id: string;
  itemId: string;
  profileId: string;
  quantity: number;
  expAt: string;
  inUseQuantity: number;
};

export type IInventory = Pick<IItem, 'quantity' | 'expAt'> & Omit<IShop, 'popular' | 'isPopular'>;

export type IRandomGift = {
  type: RandomGiftTypeEnum;
  value: number | Omit<IShop, 'popular' | 'isPopular'>;
};

export type IReward =
  | {
      message: string;
    }
  | IRandomGift;

export type IIPAResult = {
  correct_letters: string;
  file_id: string;
  original_ipa_transcript: string;
  original_transcript: string;
  pronunciation_accuracy: string;
  voice_ipa_transcript: string;
  voice_transcript: string;
};
