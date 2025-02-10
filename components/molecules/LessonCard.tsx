import { BookMarked, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Progress } from '~/components/ui/Progress';
import Styles from '~/constants/GlobalStyles';
import { ILesson } from '~/lib/types';

type LessonCardProps = {
  t: (key: string) => string;
  item: ILesson;
  lessons: ILesson[];
  handlePrev: () => void;
  handleNext: () => void;
};

const LessonCard = ({ t, item, lessons, handlePrev, handleNext }: LessonCardProps) => {
  return (
    <View style={[styles.card, Styles.backgroundColor.neutral[50]]}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={handlePrev} disabled={item.order === 1} style={{ padding: 4 }}>
          <ChevronLeft size={24} color={item.order === 1 ? 'grey' : 'black'} />
        </TouchableOpacity>
        <Text style={[Styles.font.semibold, Styles.fontSize['title-4']]}>
          {item.order}/{lessons.length}
        </Text>
        <TouchableOpacity onPress={handleNext} disabled={item.order === lessons.length} style={{ padding: 4 }}>
          <ChevronRight size={24} color={item.order === lessons.length ? 'grey' : 'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={[styles.bookmark, Styles.backgroundColor.white]}>
          <BookMarked size={24} color='black' />
        </View>
        <Text style={[styles.cardTitle, Styles.font.semibold, Styles.fontSize['title-2']]}>{item.name}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Progress value={(item.xp / 50) * 100} />
        </View>
        <Text style={[Styles.font.medium, Styles.fontSize.subhead, Styles.color.supportingText]}>
          {t('questionTypes.xp')} {item.xp}/50
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardContent: {
    gap: 8,
  },
  bookmark: {
    width: 48,
    height: 48,
    borderRadius: 100,
    padding: 12,
  },
  cardTitle: {
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressBar: {
    height: 8,
    flexGrow: 1,
  },
});

export default LessonCard;
