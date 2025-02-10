import { Image, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Styles from '~/constants/GlobalStyles';
import { IQuestion } from '~/lib/types/questions';
import { getQuestionCardDecoration } from '~/lib/utils/question-decoration';

import ScrollableReadingContainer from '../../molecules/exercise/ScrollableReadingContainer';
import { TrackAudio } from '../../molecules/TrackAudio';

type QuestionCardProps = {
  data: IQuestion;
  isPaused?: boolean;
};

const QuestionCard = ({ data, isPaused = false }: QuestionCardProps) => {
  const hasImage = data.imageId && data.image;
  const hasAudio = data.audioId && data.audio;

  const renderParagraph = () => {
    const decoration = getQuestionCardDecoration(data.content.paragraph);

    if (hasAudio || data.content.paragraph.length === 0) return null;
    if (decoration.isScrollable || hasImage) {
      return (
        <GestureHandlerRootView style={{ position: 'relative' }}>
          <ScrollableReadingContainer>
            <Text style={styles.paragraph}>{data.content.paragraph}</Text>
            {hasImage && (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{
                    uri: data.image?.url,
                  }}
                  resizeMode='cover'
                  style={{ width: '80%', height: 300, objectFit: 'contain' }}
                />
              </View>
            )}
          </ScrollableReadingContainer>
        </GestureHandlerRootView>
      );
    }
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.paragraph}>{data.content.paragraph}</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {hasAudio && (
        <View style={{ paddingHorizontal: 16 }}>
          <TrackAudio url={data.audio?.url} checked={isPaused} />
        </View>
      )}
      {renderParagraph()}
      <Text style={styles.question}>{data.content.question}</Text>
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
    ...Styles.fontSize.subhead,
    lineHeight: 22,
  },
  question: {
    ...Styles.font.semibold,
    ...Styles.fontSize.callout,
    marginHorizontal: 16,
  },
});
export default QuestionCard;
