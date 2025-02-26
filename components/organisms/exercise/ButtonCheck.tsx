import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/Button';
import { GLOBAL_STYLES } from '~/lib/constants';

type ButtonCheckProps = {
  handleCheckAnswer: () => void;
  content: string;
};

const ButtonCheck = ({ handleCheckAnswer, content }: ButtonCheckProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[GLOBAL_STYLES.checkButtonView, { paddingBottom: (insets?.bottom ?? 32) + 48 }]}>
      <Button variant='black' size='lg' onPress={handleCheckAnswer}>
        <Text style={GLOBAL_STYLES.textButton}>{content}</Text>
      </Button>
    </View>
  );
};

export default ButtonCheck;
