import { MoveRight } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, TextStyle, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { getTextColorCorrectness } from '~/lib/utils/colorUtils';

import { Option, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import BreakableText from './BreakableText';

type MatchingItemProps = {
  showAnswerRecord?: boolean;
  answerRecord?: string;
  label: string;
  options: string[];
  selectPlaceholder: string;
  onSelect: (selection: string, label: string) => void;
  /**
   * The direction of the text and the Select component.
   */
  direction?: 'ltr' | 'rtl';
  correctness?: boolean | null;
};

const AnswerRecord = ({
  answerRecord,
  correctness,
  originalValue,
}: {
  answerRecord: string;
  correctness: boolean;
  originalValue: string;
}) => {
  return (
    <>
      <BreakableText text={originalValue ?? ''} style={getTextColorCorrectness(correctness) as TextStyle} />
      {!correctness && (
        <>
          <MoveRight size={16} color='black' />
          <BreakableText text={answerRecord ?? ''} style={getTextColorCorrectness(true)} />
        </>
      )}
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
  correctness,
}: MatchingItemProps) => {
  const [localValue, setLocalValue] = useState<string>();
  const handleSelect = (value: Option) => {
    if (value) {
      onSelect(value.value, label);
      setLocalValue(value.value);
    }
  };
  return (
    <>
      <View
        style={{
          gap: 4,
          flexWrap: 'wrap',
          width: '100%',
          flexGrow: 1,
          flexBasis: 'auto',
          flexShrink: 1,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {direction === 'ltr' && <BreakableText text={label} />}
        {showAnswerRecord ? (
          <AnswerRecord
            answerRecord={answerRecord ?? ''}
            correctness={correctness ?? false}
            originalValue={localValue ?? ''}
          />
        ) : (
          <Select onValueChange={handleSelect}>
            <SelectTrigger disabled={showAnswerRecord} style={{ minWidth: 150, backgroundColor: 'white' }}>
              <SelectValue
                placeholder={selectPlaceholder}
                style={{ ...Styles.fontSize.callout, maxWidth: 200 }}
                ellipsizeMode='tail'
                numberOfLines={1}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <ScrollView style={{ maxHeight: 200 }}>
                  {options.map((item) => (
                    <SelectItem key={item} label={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </ScrollView>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        {direction === 'rtl' && <BreakableText text={label} />}
      </View>
    </>
  );
};

export default MatchingItem;
