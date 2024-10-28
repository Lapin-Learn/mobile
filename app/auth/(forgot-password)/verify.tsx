import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { useResendVerify, useVerifyForgotPassword } from '~/hooks/react-query/useAuth';
import { cn } from '~/lib/utils';

const schema = z.object({
  code: z.array(z.string().length(1, 'Invalid code')).length(6, 'Invalid code'),
});

type VerifyFormField = z.infer<typeof schema>;

const Verify = () => {
  const { t } = useTranslation('auth');
  const { email } = useLocalSearchParams();
  const [time, setTime] = useState(60);
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

  const handleTextChange = (text: string, index: number, field: any) => {
    const newCode = [...field.value];
    newCode[index] = text;
    field.onChange(newCode);
    if (text && index < 5) {
      codeRef.current[index + 1].focus();
    } else if (text && index === 5) {
      codeRef.current[index].blur();
      handleSubmit(onSubmit)();
    } else if (!text && index > 0) {
      codeRef.current[index - 1].focus();
    }
  };

  return (
    <PlatformView>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <NavigationBar title={t('verify.title')} headerLeftShown={true} />
        <View className='w-full grow flex-col items-center justify-between px-4'>
          <View className='w-full gap-y-10'>
            <View className='flex-row'>
              <Text className='w-full flex-wrap font-inormal text-callout text-neutral-500'>
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
                      className='h-12 w-12 rounded border border-neutral-200 bg-white p-3 font-imedium text-subhead placeholder:font-isemibold placeholder:text-title-2 placeholder:text-neutral-700'
                      maxLength={1}
                      keyboardType='numeric'
                      value={field.value[i]}
                      textAlign='center'
                      allowFontScaling={false}
                      onBlur={field.onBlur}
                      onChangeText={(text) => handleTextChange(text, i, field)}
                    />
                  ))}
                </View>
              )}
            />
          </View>
          <View className='w-full gap-y-4'>
            <Button onPress={handleSubmit(onSubmit)} disabled={verifyMutation.isPending} size='lg'>
              <Text className='text-button'>{t('verify.checkOtpButton')}</Text>
            </Button>
            <View className='flex flex-row items-center justify-center gap-x-2.5'>
              <Text className='text-footnote text-neutral-900'>{t('verify.noOtp')}</Text>
              <Pressable onPress={handleResendCode} disabled={time > 0}>
                <Text className={cn('font-imedium text-footnote', time > 0 ? 'text-neutral-300' : 'text-orange-500')}>
                  {(time > 0 || resentMutation.isPending) &&
                    t('verify.resendCodeWithTime', { time: time > 0 ? time : '' })}
                  {time === 0 && !resentMutation.isPending && t('verify.resendCodeWithoutTime')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </PlatformView>
  );
};

export default Verify;
