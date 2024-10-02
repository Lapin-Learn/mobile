import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { ControllerInput } from '~/components/molecules/ControllerInput';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useUpdateUserProfile } from '~/hooks/react-query/useUser';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

type FormField = z.infer<typeof schema>;

export default function UpdateProfile() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const updateUserProfileMutation = useUpdateUserProfile();

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    // updateUserProfileMutation.mutate(data);
  };

  return (
    <SafeAreaView className='h-full'>
      <NavigationBar title={'Update Profile'} />
      <View className='h-full w-full grow flex-col items-center justify-between px-4 pb-8'>
        <View className='gap-y-20'>
          <ScrollView className='h-full'>
            <View className='flex h-full gap-y-4'>
              <ControllerInput
                props={{ name: 'username', control }}
                label={'Username'}
                placeholder={'Enter your username'}
                error={errors.username}
              />

              <ControllerInput
                props={{ name: 'fullName', control }}
                label={'Full Name'}
                placeholder={'Enter your full name'}
                error={errors.fullName}
              />

              <ControllerInput
                props={{ name: 'dob', control }}
                label={'Date of Birth'}
                placeholder={'Enter your date of birth'}
                error={errors.dob}
              />
            </View>
          </ScrollView>
          <Button
            onPress={handleSubmit(onSubmit)}
            size={'lg'}
            disabled={updateUserProfileMutation.isPending}
            className='absolute bottom-20 left-0 right-0'>
            <Text className='text-button'>{updateUserProfileMutation.isPending ? 'Updating...' : 'Update'}</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
