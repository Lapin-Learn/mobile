import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import { Button } from '~/components/ui/Button';
import { useResendVerify, useVerifyForgotPassword } from '~/hooks/react-query/useAuth';

const schema = z.object({
  code: z.array(z.string().length(1, 'Invalid code')).length(6, 'Invalid code'),
});

type VerifyFormField = z.infer<typeof schema>;

export default function Verify() {
  const { t } = useTranslation('auth');
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
    if (codeRef.current[0]) {
      codeRef.current[0].focus();
    }
  }, []);

  const { control, handleSubmit } = useForm<VerifyFormField>({
    defaultValues: { code: ['', '', '', '', '', ''] },
    resolver: zodResolver(schema),
  });

  const resentMutation = useResendVerify();
  const verifyMutation = useVerifyForgotPassword();

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart[0] + '*****' + localPart[localPart.length - 1];
    return `${maskedLocalPart}@${domain}`;
  };

  const onSubmit: SubmitHandler<VerifyFormField> = (data) => {
    const stringCode = data.code.join('');
    verifyMutation.mutate({
      email: email as string,
      otp: stringCode,
    });
  };

  const handleResendCode = () => {
    resentMutation.mutate({ email: email as string });
    setTime(60);
  };

  return (
    <SafeAreaView className='h-screen'>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title={t('verify.title')} headerLeftShown={true} />
        <View className='inline-flex w-full grow flex-col items-center justify-between bg-background px-4 pb-[21px]'>
          <View className='w-full gap-y-10'>
            <View className='flex-row'>
              <Text className='w-full flex-wrap text-callout font-normal text-neutral-500'>
                {t('verify.instruction', { email: maskEmail(email as string) })}
              </Text>
            </View>
            <Controller
              control={control}
              name='code'
              render={({ field }) => (
                <View className='flex flex-row items-center justify-center gap-x-4'>
                  {field.value.map((_, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => (codeRef.current[i] = ref!)}
                      className='h-12 w-12 rounded-none border border-neutral-200 bg-white p-3 text-subhead font-medium placeholder:text-title-2 placeholder:font-semibold placeholder:text-neutral-700'
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
                          if (i < 5) {
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
          <View className='w-full gap-y-4'>
            <Button
              className='shadow-button'
              onPress={handleSubmit(onSubmit)}
              disabled={verifyMutation.isPending}
              size={'lg'}>
              <Text className='text-body font-semibold text-white'>{t('verify.checkOtpButton')}</Text>
            </Button>
            <View className='flex flex-row items-center justify-center gap-x-2.5'>
              <Text className='text-footnote text-neutral-900'>{t('verify.noOtp')}</Text>
              <Pressable onPress={handleResendCode} disabled={time > 0}>
                <Text className={`${time > 0 ? 'text-neutral-300' : 'text-orange-500'} text-footnote font-medium`}>
                  {t('verify.resendCode', { time: time > 0 ? time : '' })}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
