import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import GlobalStyles from '~/constants/GlobalStyles';
import { useInstruction } from '~/hooks/react-query/useDailyLesson';
import { useToast } from '~/hooks/useToast';
import { useDailyLessonStore } from '~/hooks/zustand';

const Instruction = () => {
  const { currentQuestionType } = useDailyLessonStore();
  const toast = useToast();
  const { t } = useTranslation('question');
  const {
    data: instruction,
    isLoading,
    isError,
  } = useInstruction({ questionTypeId: currentQuestionType?.id.toString() ?? '' });
  const [webViewLoading, setWebViewLoading] = useState(true);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    toast.show({ type: 'error', text1: 'Failed to load instruction' });
  }

  const injectedStyle = `
  <head>
    <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
      * {
      font-family: 'Inter', sans-serif !important;
      }
    </style>
  </head>`;

  const formattedExplanation = `
      ${injectedStyle}
      <body>
        <div style="font-size: 36px;">
          ${instruction?.content || ''}
        </div>
      </body>
  `;

  return (
    <PlatformView>
      <NavigationBar headerTitle={currentQuestionType?.name} headerLeftShown />
      {webViewLoading && (
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      )}

      {instruction ? (
        <WebView
          onLoad={() => {
            setWebViewLoading(true);
          }}
          onLoadEnd={() => {
            setWebViewLoading(false);
          }}
          // just Android
          setDisplayZoomControls={true}
          originWhitelist={['*']}
          source={{ html: formattedExplanation }}
          style={{ ...GlobalStyles.backgroundColor.transparent, marginHorizontal: 16, marginBottom: 0 }}
          useWebKit={true}
        />
      ) : (
        <Text>{t('instruction.empty')}</Text>
      )}
    </PlatformView>
  );
};

export default Instruction;
