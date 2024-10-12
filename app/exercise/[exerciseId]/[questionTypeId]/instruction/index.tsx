import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { useInstruction } from '~/hooks/react-query/useDailyLesson';
import { useToast } from '~/hooks/useToast';
import { useDailyLessonStore } from '~/hooks/zustand';

export default function Instruction() {
  const windowWidth = useWindowDimensions().width;
  const { currentQuestionType } = useDailyLessonStore();
  const toast = useToast();
  const {
    data: instruction,
    isLoading,
    isError,
  } = useInstruction({ questionTypeId: currentQuestionType.id.toString() });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    toast.show({ type: 'error', text1: 'Failed to load instruction' });
  }

  return (
    <SafeAreaView>
      <NavigationBar headerTitle={currentQuestionType.name} headerLeftShown />
      <ScrollView className='px-4'>
        {instruction ? (
          <View className='mb-20'>
            <HTML source={{ html: instruction.content }} contentWidth={windowWidth} />
          </View>
        ) : (
          <Text>Chưa có lý thuyết cho phần này</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
