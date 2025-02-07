import { router } from 'expo-router';
import { LucideX } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { default as GlobalStyles } from '~/constants/GlobalStyles';
import { bottomScreenGap } from '~/constants/Padding';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';
import { GLOBAL_STYLES } from '~/lib/constants';
import { formatHtmlContent } from '~/lib/utils';

const Explanation = () => {
  const { t } = useTranslation('question');
  const [webViewLoading, setWebViewLoading] = useState(true);

  const {
    state: { currentQuestion },
  } = useDailyLessonQuestionStore();

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
      <NavigationBar headerLeftShown icon={LucideX} headerTitle={t('explanation.title')} />

      {webViewLoading && (
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      )}

      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <WebView
          onLoad={() => {
            setWebViewLoading(true);
          }}
          onLoadEnd={() => {
            setWebViewLoading(false);
          }}
          // just Android
          textZoom={100}
          setDisplayZoomControls={true}
          originWhitelist={['*']}
          source={{ html: formatHtmlContent(currentQuestion?.explanation) }}
          style={{ ...GlobalStyles.backgroundColor.transparent, marginTop: 16 }}
        />

        {/* <AnswerField answers={answer} /> */}
      </View>

      <View
        style={{
          padding: 16,
          paddingBottom: bottomScreenGap,
        }}>
        <Button
          style={{
            ...GlobalStyles.backgroundColor.neutral[900],
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
