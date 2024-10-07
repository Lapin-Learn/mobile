import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ContentTypeEnum } from '~/lib/enums';
import { TypeQuestion } from '~/lib/types/questions';

import ContentText from '../ContentText';
import ReadingContainer from '../ReadingContainer';
import { TrackAudio } from '../TrackAudio';

interface QuestionCardProps {
  data: TypeQuestion;
  isPaused?: boolean;
}
export default function QuestionCard({ data, isPaused = false }: QuestionCardProps) {
  const { t } = useTranslation('question');

  return (
    <View className='gap-3'>
      <Text className='text-title-3 font-bold'>{t('multipleChoice.title')}</Text>
      {data.audioId && <TrackAudio data={data.audio ?? { id: '', url: '' }} checked={isPaused} />}
      {!data.audioId && data.content.paragraph && (
        <ReadingContainer>
          <ContentText>{data.content.paragraph}</ContentText>
        </ReadingContainer>
      )}
      {data.contentType === ContentTypeEnum.MULTIPLE_CHOICE && (
        <Text className='text-title-4 font-bold'>{data.content.question}</Text>
      )}
    </View>
  );
}
