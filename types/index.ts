import { SkillEnum } from '~/enums';

export type TokenType = {
  token_type: string | null;
  accessToken: string | null;
};

export type QuestionTypesSearchParams = {
  skill: SkillEnum;
};

export enum Skill {
  READING = 'reading',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  WRITING = 'writing',
}
