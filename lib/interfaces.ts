import {
  BandScoreEnum,
  CEFRLevelEnum,
  ContentTypeEnum,
  GenderEnum,
  MilestonesEnum,
  RankEnum,
  SkillEnum,
} from './enums';
import { Question } from './types';

export interface IQuestionType {
  id: number;
  name: string;
  skill: SkillEnum;
  imageId: string;
  lessons: number;
  progress: {
    bandScore: BandScoreEnum;
    totalLearningXP: number;
  };
  image: IImage;
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

export interface IQuestion {
  id: string;
  contentType: ContentTypeEnum;
  content: Question;
  imageId: string | null;
  audioId: string | null;
  cerfLevel: CEFRLevelEnum;
  explanation: string;
  audio?: IAudio;
}

export interface IAudio {
  id: string;
  url: string;
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
    question: IQuestion;
    questionId: string;
  }[];
}

export interface IMilestone {
  type: MilestonesEnum;
  newValue: ILevel | RankEnum;
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

export interface IImage {
  id: string;
  name: string;
  owner: string;
  permission: string;
  url: string;
}

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
