import { router } from 'expo-router';
import { LucideX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';

import ChoiceButton from '~/components/molecules/ChoiceButton';
import { ChoiceCheckBox } from '~/components/molecules/ChoiceCheckBox';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';
import { Button } from '~/components/ui/Button';
import { useGameStore } from '~/hooks/zustand';
import { ContentTypeEnum } from '~/lib/enums';

function MultipleChoiceAnswer({ answers }: { answers: string[] }) {
  if (answers.length === 0) return <View></View>;
  if (answers.length === 1) {
    return (
      <View>
        <ChoiceButton
          index={0}
          label={answers[0]}
          selectedBox={[0]}
          isChecking={true}
          isCorrect={true}
          onPress={() => {}}
        />
      </View>
    );
  }

  return (
    <View>
      {answers.map((item, index) => (
        <ChoiceCheckBox
          key={index}
          index={index}
          label={item}
          selectedBox={Array.from({ length: answers.length }, (_, i) => i)}
          checked={true}
          isChecking={true}
          isCorrect={true}
          onPress={() => {}}
          onCheckedChange={() => {}}
        />
      ))}
    </View>
  );
}

export default function Explanation() {
  const { t } = useTranslation('question');
  const windowWidth = useWindowDimensions().width;

  const { contentType, answer, explanation } = useGameStore();

  const formattedExplanation = `
    <div style="font-size: 17px; line-height: 25.5px;">
      ${explanation}
    </div>`;

  const AnswerField = ({ answers }: { answers: string[] }) => {
    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE:
        return <MultipleChoiceAnswer answers={answers} />;
      default:
        return <Text>{t('general.unsupportedQuestionType')}</Text>;
    }
  };

  return (
    <PlatformView>
      <ScrollView>
        <NavigationBar headerLeftShown icon={LucideX} headerTitle={t('explanation.title')} />
        <View className='m-4 mb-20 flex grow flex-col justify-between'>
          <View className='gap-y-8'>
            <View className='gap-y-3'>
              <View>
                <HTML source={{ html: formattedExplanation }} contentWidth={windowWidth} />
              </View>
            </View>
            <AnswerField answers={answer} />
          </View>
        </View>
      </ScrollView>
      <View className='absolute bottom-0 left-0 right-0 bg-background p-4 pb-10'>
        <Button
          className='bg-neutral-900'
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.dismiss();
            }
          }}>
          <Text className='text-button'>{t('explanation.understood')}</Text>
        </Button>
      </View>
    </PlatformView>
  );
}
