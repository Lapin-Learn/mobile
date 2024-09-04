export type TokenType = {
  token_type: string | null;
  access_token: string | null;
};

export enum Skill {
  READING = 'reading',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  WRITING = 'writing',
}
