import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/types/questions';

import ReadingContainer from '../../molecules/exercise/ScrollableReadingContainer';
import { TrackAudio } from '../../molecules/TrackAudio';

type QuestionCardProps = {
  data: IQuestion;
  isPaused?: boolean;
};
const QuestionCard = ({ data, isPaused = false }: QuestionCardProps) => {
  const { t } = useTranslation('question');

  return (
    <View className='mb-2 mt-2 gap-3'>
      <Text className='font-ibold text-title-4'>{t('multipleChoice.title')}</Text>
      {data.audioId && <TrackAudio data={data.audio ?? { id: '', url: '' }} checked={isPaused} />}
      {!data.audioId && data.content.paragraph && (
        <ReadingContainer>
          <Text className='p-4 text-body leading-8'>{data.content.paragraph}</Text>
        </ReadingContainer>
      )}
      {data.contentType === ContentTypeEnum.MULTIPLE_CHOICE && (
        <Text className='font-ibold text-title-4'>{data.content.question}</Text>
      )}
    </View>
  );
};

export default QuestionCard;
