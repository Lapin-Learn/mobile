import { ActionNameEnum, BandScoreEnum, GenderEnum, MilestonesEnum, RankEnum, SkillEnum } from './enums';
import { TypeQuestion } from './types/questions';

export interface IQuestionType {
  id: number;
  name: string;
  skill: SkillEnum;
  imageId: string | null;
  lessons: number;
  progress: {
    bandScore: BandScoreEnum;
    totalLearningXP: number;
  };
  image: IImage | null;
}

export interface ILesson {
  id: number;
  name: string;
  order: number;
  questionTypeId: number;
  bandScore: BandScoreEnum;
  isCurrent: boolean;
  xp: number;
}

export interface ILessonsResponse {
  lessons: ILesson[];
  totalLearningDuration: number;
}

export interface ILessonQuestionsResponse {
  id: number;
  name: string;
  order: number;
  questionToLessons: {
    order: number;
    question: TypeQuestion;
    questionId: string;
  }[];
}

export interface IMilestone {
  type: MilestonesEnum;
  newValue: ILevel | RankEnum | number;
}

export interface IAfterLesson {
  lessonId: number;
  bonusCarrot: number;
  bonusXP: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
  milestones: IMilestone[];
}

export interface IUserProfile {
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
}

export interface IBucket {
  id: string;
  name: string;
  owner: string;
  permission: string;
  url: string;
}
export interface IImage extends IBucket {}
export interface IAudio extends IBucket {}

export interface ILearnerProfile {
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
}

export interface ILevel {
  id: number;
  xp: number;
}

export interface IStreak {
  id: number;
  current: number;
  target: number;
  record: number;
}

export interface IStreakHistory {
  date: string;
  actionName: ActionNameEnum.STREAK;
}

export interface IInstruction {
  id: string;
  content: string;
  order: number;
  imageId: string;
  audioId: string;
  questionTypeId: number;
  image?: string;
  audio?: string;
}

export interface IPresignedUrl {
  id: string;
  url: string;
}

export interface IGameProfile {
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
  profileBadges: any[];
  profileMissions: any[];
  profileItems: any[];
  currentItems: any[];
}

export interface IHistoryStreak {
  date: string;
  actionName: ActionNameEnum;
}
