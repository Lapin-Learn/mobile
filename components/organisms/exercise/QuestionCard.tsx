import { StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
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
    <View style={styles.root}>
      {data.audioId && <TrackAudio data={data.audio ?? { id: '', url: '' }} checked={isPaused} />}
      {!data.audioId && data.content.paragraph && (
        <ReadingContainer>
          <Text style={styles.paragraph}>{data.content.paragraph}</Text>
        </ReadingContainer>
      )}
      {data.contentType === ContentTypeEnum.MULTIPLE_CHOICE && (
        <Text style={styles.question}>{data.content.question}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginVertical: 8,
    gap: 12,
  },
  paragraph: {
    ...Styles.font.normal,
    ...Styles.fontSize.body,
    lineHeight: 28,
  },
  question: {
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
    marginHorizontal: 16,
  },
});
export default QuestionCard;
