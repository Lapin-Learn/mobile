import { Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import { Option, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

type MatchingItemProps = {
  showAnswerRecord?: boolean;
  answerRecord?: string;
  label: string;
  options: string[];
  selectPlaceholder: string;
  onSelect: (value: string, option: string) => void;
  /**
   * The direction of the text and the Select component.
   */
  direction?: 'ltr' | 'rtl';
};

const BreakableText = ({ text }: { text: string }) => {
  return (
    <>
      {text.split(' ').map((word, id) => (
        <Text key={`${word}-${id}`} style={{ ...Styles.fontSize['callout'] }}>
          {word}
        </Text>
      ))}
    </>
  );
};

const MatchingItem = ({
  showAnswerRecord,
  answerRecord,
  label,
  selectPlaceholder,
  options,
  onSelect,
  direction = 'ltr',
}: MatchingItemProps) => {
  const handleSelect = (value: Option) => {
    if (value) {
      onSelect(value.value, label);
    }
  };
  return (
    <>
      <View
        style={{
          gap: 4,
          flexWrap: 'wrap',
          alignItems: 'center',
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
        }}>
        <BreakableText text={label} />
        <Select
          onValueChange={handleSelect}
          style={{
            margin: 8,
          }}>
          <SelectTrigger disabled={showAnswerRecord} style={{ minWidth: 150, backgroundColor: 'white' }}>
            <SelectValue placeholder={selectPlaceholder} style={{ ...Styles.fontSize.callout }} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((item) => (
                <SelectItem key={item} label={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </View>
      {showAnswerRecord && <Text>{answerRecord}</Text>}
    </>
  );
};

export default MatchingItem;
