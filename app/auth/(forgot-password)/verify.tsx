import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useResendVerify, useVerifyForgotPassword } from '~/hooks/react-query/useAuth';
import { GLOBAL_STYLES } from '~/lib/constants';
import { AuthActionEnum } from '~/lib/enums';
import { maskEmail } from '~/lib/utils';

const schema = z.object({
  code: z.array(z.string().length(1, 'error.code')).length(6, 'error.code'),
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

  const onSubmit: SubmitHandler<VerifyFormField> = (data) => {
    const stringCode = data.code.join('');
    verifyMutation.mutate({
      email: email as string,
      otp: stringCode,
      action: AuthActionEnum.RESET_PASSWORD,
    });
  };

  const handleResendCode = () => {
    resentMutation.mutate({ email: email as string, action: AuthActionEnum.RESET_PASSWORD });
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
        <View style={styles.container}>
          <View style={styles.instructionContainer}>
            <View style={styles.instructionTextContainer}>
              <Text
                style={StyleSheet.flatten([
                  styles.instructionText,
                  Styles.font.normal,
                  Styles.fontSize.callout,
                  Styles.color.neutral[500],
                ])}>
                {t('verify.instruction')}
                <Text style={{ ...Styles.color.orange[900] }}>{maskEmail(email as string)}</Text>
              </Text>
            </View>
            <Controller
              control={control}
              name='code'
              render={({ field }) => (
                <View style={styles.codeInputContainer}>
                  {field.value.map((_, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => (codeRef.current[i] = ref!)}
                      style={styles.codeInput}
                      placeholderTextColor={Styles.color.neutral[700].color}
                      maxLength={1}
                      textAlignVertical='center'
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
          <View style={styles.buttonContainer}>
            <Button size='lg' onPress={handleSubmit(onSubmit)} disabled={verifyMutation.isPending}>
              <Text style={GLOBAL_STYLES.textButton}>{t('verify.checkOtpButton')}</Text>
            </Button>
            <View style={styles.resendContainer}>
              <Text
                style={{
                  ...Styles.fontSize.footnote,
                  ...Styles.color.neutral[900],
                }}>
                {t('verify.noOtp')}
              </Text>
              <Pressable onPress={handleResendCode} disabled={time > 0}>
                <Text
                  style={[
                    Styles.fontSize.footnote,
                    Styles.font.medium,
                    Styles.color.orange[500],
                    time > 0 && Styles.color.neutral[300],
                  ]}>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  instructionContainer: {
    gap: 40,
  },
  instructionTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  instructionText: {
    width: '100%',
    flexWrap: 'wrap',
  },
  codeInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeInput: {
    height: 48,
    width: 48,
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.backgroundColor.white,
    ...Styles.borderColor.neutral[200],
    ...Styles.font.semibold,
    ...Styles.fontSize['title-2'],
    textAlignVertical: 'center',
    padding: 12,
    textAlign: 'center',
  },
  codeInputPlaceholder: {
    ...Styles.font.semibold,
    ...Styles.fontSize['title-2'],
    ...Styles.color.neutral[700],
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
