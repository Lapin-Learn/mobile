import { router } from 'expo-router';
import { BookOpenText } from 'lucide-react-native';
import { ScrollView } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { bandscoreMappings } from '~/lib/constants/labelMappings';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '../ui/Select';

type BandScoreSelectProps = {
  value: string;
};

const BandScoreSelect = ({ value }: BandScoreSelectProps) => {
  return (
    <Select
      value={{
        label: bandscoreMappings[value],
        value,
      }}
      onValueChange={(value) => {
        router.setParams({ bandScore: value?.value });
      }}>
      <SelectTrigger style={{ borderWidth: 0 }} hideIcon>
        <BookOpenText size={24} color={Styles.color.neutral[300].color} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <ScrollView style={{ maxHeight: 200 }}>
            {Object.entries(bandscoreMappings).map(([key, value]) => (
              <SelectItem key={key} value={key} label={value} />
            ))}
          </ScrollView>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BandScoreSelect;
