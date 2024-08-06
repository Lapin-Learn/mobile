import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { useVerifyForgotPassword } from '~/hooks/react-query/useAuth';

const schema = z.object({
  code: z.array(z.string().length(1, 'Invalid code')).length(4, 'Invalid code'),
});

type VerifyFormField = z.infer<typeof schema>;

export default function Verify() {
  const { email } = useLocalSearchParams();
  const [time, setTime] = useState(5);
  const codeRef = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    // Focus the first input when the component mounts
    if (codeRef.current[0]) {
      codeRef.current[0].focus();
    }
  }, []);

  const { control, handleSubmit, setError } = useForm<VerifyFormField>({
    defaultValues: { code: ['', '', '', ''] },
    resolver: zodResolver(schema),
  });

  const verifyMutation = useVerifyForgotPassword();

  const onSubmit: SubmitHandler<VerifyFormField> = async (data) => {
    try {
      // TODO: Call your API here (#1)
      const stringCode = data.code.join('');
      await verifyMutation.mutateAsync({
        email: email as string,
        code: stringCode,
      });
    } catch {
      setError('code', { message: 'Invalid code' });
    }
  };

  const handleResendCode = () => {
    setTime(60);
  };

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={10} enabled={true}>
        <View className='w-full h-full left-[5%] flex flex-col justify-center gap-4'>
          <View className='flex grow justify-center items-start'>
            <Text className='font-bold text-4xl'>OTP Verification</Text>
            <Text>
              Enter the OTP sent to <Text className='font-bold'>{email}</Text>
            </Text>
            <Controller
              control={control}
              name='code'
              render={({ field }) => (
                <View className='w-full flex flex-row gap-x-5 justify-center items-center'>
                  {field.value.map((_, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => (codeRef.current[i] = ref!)}
                      className='w-12 h-14 p-2 border-2 border-gray-300 rounded-md font-bold text-5xl'
                      maxLength={1}
                      keyboardType='numeric'
                      value={field.value[i]}
                      textAlign='center'
                      allowFontScaling={false}
                      onBlur={field.onBlur}
                      onChangeText={(text) => {
                        const newCode = [...field.value];
                        newCode[i] = text;
                        field.onChange(newCode);
                        if (text.length === 1) {
                          if (i < 3) {
                            codeRef.current[i + 1].focus();
                          } else {
                            codeRef.current[i].blur();
                            handleSubmit(onSubmit)();
                          }
                        }
                      }}
                    />
                  ))}
                </View>
              )}
            />
          </View>
          <Pressable onPress={handleResendCode} disabled={time > 0}>
            <Text
              className={`text-center text-lg ${time > 0 ? 'text-blue-300' : ''}`}>{`Resend OTP${time > 0 ? ` after ${time} seconds` : ''}`}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
