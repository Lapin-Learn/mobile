import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      {data.audioId && (
        <View style={{ paddingHorizontal: 16 }}>
          <TrackAudio url={data.audio?.url} checked={isPaused} />
        </View>
      )}
      {!data.audioId && data.content.paragraph && (
        <GestureHandlerRootView style={{ position: 'relative' }}>
          <ReadingContainer>
            <Text style={styles.paragraph}>{data.content.paragraph}</Text>
          </ReadingContainer>
        </GestureHandlerRootView>
      )}
      {(data.contentType === ContentTypeEnum.MULTIPLE_CHOICE ||
        data.contentType === ContentTypeEnum.FILL_IN_THE_BLANK) && (
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
