// components/molecules/useFormInput.ts
import { FieldError, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { TextInputProps } from 'react-native';

import SelectInput from '~/components/molecules//form-input/SelectInput';
import CustomDateInput from '~/components/molecules/form-input/CustomDateInput';
import CustomTextInput from '~/components/molecules/form-input/CustomTextInput';
import PasswordInput from '~/components/molecules/form-input/PasswordInput';

export type ControllerInputType = 'text' | 'email' | 'number' | 'date' | 'select' | 'password';

export type FormInputProps<T = Record<string, string>> = {
  props: UseControllerProps<T & FieldValues>;
  label: string;
  placeholder: string;
  error: FieldError | undefined;
  type?: ControllerInputType;
  defaultLabel?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export const useFormInput = <T,>({
  props,
  label,
  placeholder,
  error,
  type,
  defaultLabel,
  options,
}: FormInputProps<T>) => {
  const { field } = useController(props);

  const renderInput = (inputProps: TextInputProps) => {
    switch (type) {
      case 'text':
        return <CustomTextInput placeholder={placeholder} {...inputProps} />;
      case 'password':
        return <PasswordInput placeholder={placeholder} {...inputProps} />;
      case 'number':
        return <CustomTextInput placeholder={placeholder} {...inputProps} keyboardType='numeric' />;
      case 'email':
        return <CustomTextInput placeholder={placeholder} {...inputProps} keyboardType='email-address' />;
      case 'date':
        return <CustomDateInput placeholder={placeholder} props={props} {...inputProps} />;
      case 'select':
        return (
          <SelectInput
            defaultValue={{
              value: field.value,
              label: defaultLabel || options?.find((option) => option.value === field.value)?.label || '',
            }}
            onValueChange={(option) => field.onChange(option?.value)}
            options={options || []}
            placeholder={placeholder}
            style={inputProps.style}
          />
        );

      default:
        return <CustomTextInput placeholder={placeholder} {...inputProps} />;
    }
  };

  return { renderInput, label, error, field, placeholder };
};
