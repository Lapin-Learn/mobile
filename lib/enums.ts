export enum SkillEnum {
  READING = 'reading',
  LISTENING = 'listening',
  WRITING = 'writing',
  SPEAKING = 'speaking',
}

export enum BandScoreEnum {
  PRE_IELTS = 'pre_ielts',
  BAND_4_5 = '4.5',
  BAND_5_0 = '5.0',
  BAND_5_5 = '5.5',
  BAND_6_0 = '6.0',
  BAND_6_5 = '6.5',
  BAND_7_0 = '7.0',
}

export enum ContentTypeEnum {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_IN_THE_BLANK = 'fill_in_the_blank',
  MATCHING = 'matching',
  PRONUNCIATION = 'pronunciation',
}

export enum CEFRLevelEnum {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
  Any = 'Any',
}

export enum ProviderNameEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum MilestonesEnum {
  DAILY_STREAK = 'daily_streak',
  LEVEL_UP = 'level_up',
  RANK_UP = 'rank_up',
  BAND_SCORE_UP = 'band_score_question_type_up',
  MISSION_COMPLETED = 'mission_completed',
}

export enum RankEnum {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  MASTER = 'master',
}

export enum ActionNameEnum {
  DAILY_LOGIN = 'daily_login',
  TASK_COMPLETED = 'task_completed',
  DAILY_STREAK = 'daily_streak',
}

export enum MissionCategoryEnum {
  COMPLETE_LESSON_WITH_PERCENTAGE_SCORE = 'COMPLETE_LESSON_WITH_PERCENTAGE_SCORE',
  COMPLETE_LESSON_WITH_DIFFERENT_SKILLS = 'COMPLETE_LESSON_WITH_DIFFERENT_SKILLS',
  TOTAL_DURATION_OF_LEARN_DAILY_LESSON = 'TOTAL_DURATION_OF_LEARN_DAILY_LESSON',
  EXCEED_LEARNING_STREAK = 'EXCEED_LEARNING_STREAK',
  EXCEED_LEARNING_STREAK_WITHOUT_BREAK = 'EXCEED_LEARNING_STREAK_WITHOUT_BREAK',
  COMPLETE_LISTENING_SESSION = 'COMPLETE_LISTENING_SESSION',
  COMPLETE_READING_SESSION = 'COMPLETE_READING_SESSION',
  COMPLETE_SPEAKING_SESSION = 'COMPLETE_SPEAKING_SESSION',
  COMPLETE_WRITING_SESSION = 'COMPLETE_WRITING_SESSION',
  COMPLETE_DISTINCT_SKILL_SESSION = 'COMPLETE_DISTINCT_SKILL_SESSION',
  COMPLETE_DISTINCT_SKILL_TEST_SESSION = 'COMPLETE_DISTINCT_SKILL_TEST_SESSION',
}

export enum MissionStatusEnum {
  COMPLETED = 'completed',
  ASSIGNED = 'assigned',
  RECEIVED = 'received',
}

export enum ItemEnum {
  STREAK_FREEZE = 'STREAK_FREEZE',
  RANDOM_GIFT = 'RANDOM_GIFT',
  ULTIMATE_TIME = 'ULTIMATE_TIME',
  IDENTIFICATION = 'IDENTIFICATION',
}

export enum RandomGiftTypeEnum {
  CARROTS = 'carrots',
  ITEM = 'item',
}

export enum AuthActionEnum {
  RESET_PASSWORD = 'reset-password',
  VERIFY_MAIL = 'verify-mail',
}
