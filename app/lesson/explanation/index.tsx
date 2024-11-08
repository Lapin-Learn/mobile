import { router } from 'expo-router';
import { LucideX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';
import { GLOBAL_STYLES } from '~/lib/constants';

// TODO: extract to a separate component
// const MultipleChoiceAnswer = ({ answers }: { answers: string[] }) => {
//   if (answers.length === 0) return <View></View>;
//   if (answers.length === 1) {
//     return (
//       <View>
//         <ChoiceButton label={answers[0]} onPress={() => {}} />
//       </View>
//     );
//   }

//   return (
//     <View>
//       {answers.map((item, index) => (
//         <ChoiceCheckBox key={index} label={item} checked={true} onPress={() => {}} onCheckedChange={() => {}} />
//       ))}
//     </View>
//   );
// }

const Explanation = () => {
  const { t } = useTranslation('question');
  const windowWidth = useWindowDimensions().width;

  const {
    state: { currentQuestion },
  } = useDailyLessonQuestionStore();

  const formattedExplanation = `
    <div style="font-size: 17px; line-height: 25.5px;">
      ${currentQuestion?.explanation || ''}
    </div>`;

  // TODO: refactor this to compatible with new hook useLesson
  // const AnswerField = ({ answers }: { answers: string[] }) => {
  //   switch (contentType) {
  //     case ContentTypeEnum.MULTIPLE_CHOICE:
  //       return <MultipleChoiceAnswer answers={answers} />;
  //     default:
  //       return <Text>{t('general.unsupportedQuestionType')}</Text>;
  //   }
  // };

  return (
    <PlatformView>
      <ScrollView>
        <NavigationBar headerLeftShown icon={LucideX} headerTitle={t('explanation.title')} />
        <View
          style={{
            margin: 16,
            marginBottom: 80,
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View style={{ gap: 36 }}>
            <View style={{ gap: 12 }}>
              <View>
                <HTML source={{ html: formattedExplanation }} contentWidth={windowWidth} />
              </View>
            </View>
            {/* <AnswerField answers={answer} /> */}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          ...Styles.backgroundColor.white,
          padding: 16,
          paddingBottom: 40,
        }}>
        <Button
          style={{
            ...Styles.backgroundColor.neutral[900],
          }}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.dismiss();
            }
          }}>
          <Text style={GLOBAL_STYLES.textButton}>{t('explanation.understood')}</Text>
        </Button>
      </View>
    </PlatformView>
  );
};

export default Explanation;
