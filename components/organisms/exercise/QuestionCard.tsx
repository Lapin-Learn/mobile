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
  return (
    <View className='mb-2 mt-2 gap-3'>
      {data.audioId && <TrackAudio data={data.audio ?? { id: '', url: '' }} checked={isPaused} />}
      {!data.audioId && data.content.paragraph && (
        <ReadingContainer>
          <Text className='p-4 text-body leading-8'>{data.content.paragraph}</Text>
        </ReadingContainer>
      )}
      {(data.contentType === ContentTypeEnum.MULTIPLE_CHOICE ||
        data.contentType === ContentTypeEnum.FILL_IN_THE_BLANK) && (
        <Text className='font-ibold text-title-4'>{data.content.question}</Text>
      )}
    </View>
  );
};

export default QuestionCard;
