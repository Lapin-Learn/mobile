import { Text, TextStyle } from 'react-native';

import Styles from '~/constants/GlobalStyles';

type BreakableTextProps = {
  text: string;
  style?: TextStyle;
};

const BreakableText = ({ text, style }: BreakableTextProps) => {
  return (
    <>
      {text.split(' ').map((word, id) => (
        <Text
          key={`${word}-${id}`}
          style={[{ ...Styles.fontSize['callout'] }, style]}
          adjustsFontSizeToFit
          numberOfLines={2}>
          {word}
        </Text>
      ))}
    </>
  );
};

export default BreakableText;
