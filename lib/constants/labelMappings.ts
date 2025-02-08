import { BandScoreEnum } from '../enums';

const bandscoreMappings: Record<string, string> = {
  [BandScoreEnum.PRE_IELTS]: 'Pre IELTS',
  [BandScoreEnum.BAND_4_5]: 'Band 4.5',
  [BandScoreEnum.BAND_5_0]: 'Band 5.0',
  [BandScoreEnum.BAND_5_5]: 'Band 5.5',
  [BandScoreEnum.BAND_6_0]: 'Band 6.0',
  [BandScoreEnum.BAND_6_5]: 'Band 6.5',
  [BandScoreEnum.BAND_7_0]: 'Band 7.0',
};

export { bandscoreMappings };
