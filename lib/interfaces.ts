import { BandScoreEnum, CEFRLevelEnum, ContentTypeEnum, GenderEnum, SkillEnum } from './enums';
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

export interface ILessonCompletion {
  lessonId: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
}

export interface IAfterLesson {
  lessonId: number;
  carrots: number;
  xp: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
}

export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string | null;
  dob: string | null;
  gender: GenderEnum | null;
  createdAt: string;
  learnerProfile: ILearnerProfile;
  avatarId: string | null;
  avatar?: IAvatar;
}

export interface IAvatar {
  id: string;
  name: string;
  owner: string;
  permission: string;
  url: string;
}

export interface ILearnerProfile {
  id: string;
  rank: string;
  levelId: number;
  xp: number;
  carrots: number;
  streakId: number;
  createdAt: string;
  updatedAt: string;
  streak?: IStreak;
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
