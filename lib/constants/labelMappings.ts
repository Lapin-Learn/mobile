import { BandScoreEnum, RankEnum } from '../enums';

const bandscoreMappings: Record<string, string> = {
  [BandScoreEnum.PRE_IELTS]: 'Pre IELTS',
  [BandScoreEnum.BAND_4_5]: 'Band 4.5',
  [BandScoreEnum.BAND_5_0]: 'Band 5.0',
  [BandScoreEnum.BAND_5_5]: 'Band 5.5',
  [BandScoreEnum.BAND_6_0]: 'Band 6.0',
  [BandScoreEnum.BAND_6_5]: 'Band 6.5',
  [BandScoreEnum.BAND_7_0]: 'Band 7.0',
};

const rankLevelMappings: Record<RankEnum, string> = {
  [RankEnum.BRONZE]: '1-9',
  [RankEnum.SILVER]: '10-19',
  [RankEnum.GOLD]: '20-49',
  [RankEnum.PLATINUM]: '50-99',
  [RankEnum.DIAMOND]: '100-149',
  [RankEnum.MASTER]: '150++',
};

export { bandscoreMappings, rankLevelMappings };
