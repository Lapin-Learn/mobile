import { BandScoreEnum, SkillEnum } from './enums';
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
  contentType: string;
  content: Question;
  imageId: string | null;
  audioId: string | null;
  cerfLevel: string;
  explanation: string;
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

export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string | null;
  dob: string | null;
  gender: string | null;
  createdAt: string;
  learnerProfile: ILearnerProfile;
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
