import { Text, View } from 'react-native';
export type ProfileItemProps = {
  label: string;
  value: string;
};
const ProfileItem = ({ label, value }: ProfileItemProps) => {
  return (
    <View className='mt-2 flex flex-row justify-between'>
      <Text className='text-sup text-title-4'>{label}</Text>
      <Text className='text-title-4 text-neutral-900'>{value}</Text>
    </View>
  );
};

export default ProfileItem;
