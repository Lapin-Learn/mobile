import { BandScoreEnum, CERFLevelEnum, ContentTypeEnum, SkillEnum } from './enums';

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
  id: number;
  questionTypeId: number;
  lessonId: number;
  question: string;
  answer: string;
}

export interface ILessonsResponse {
  lessons: ILesson[];
  totalLearningDuration: number;
}

export interface IQuestionResponse {
  contentType: ContentTypeEnum;
  content: object;
  imageId: string;
  audioId: string;
  cerfLevel: CERFLevelEnum;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}
