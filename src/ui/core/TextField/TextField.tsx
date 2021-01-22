import React from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';
import { Text, TextField as BaseTextField } from '@gpn-prototypes/vega-ui';
import cn from 'bem-cn';

import './TextField.css';

type BaseTextFieldProps = React.ComponentProps<typeof BaseTextField>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TextFieldProps<T = any> = {
  name: string;
  placeholder: string;
  input: FieldInputProps<T>;
  meta: FieldMetaState<T>;
  testId?: string;
} & Partial<BaseTextFieldProps>;

const cnTextField = cn('VegaTextField');

export const TextField: React.FC<TextFieldProps> = (props) => {
  const { input, meta, name, placeholder, testId, ...rest } = props;

  const submitErrorText =
    meta.submitError && !meta.dirtySinceLastSubmit ? meta.submitError : undefined;
  const showError = (Boolean(meta.error || submitErrorText) && meta.submitFailed) || !meta.pristine;
  const errorText = meta.error || submitErrorText;

  return (
    <>
      <BaseTextField
        id={name}
        size="s"
        width="full"
        name={input.name}
        state={showError ? 'alert' : undefined}
        placeholder={placeholder}
        autoComplete="off"
        value={input.value}
        onChange={({ e }): void => input.onChange(e)}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        data-testid={testId}
        {...rest}
      />
      {showError && (
        <Text
          size="xs"
          lineHeight="xs"
          view="alert"
          className={cnTextField('ErrorText').toString()}
          data-testid={testId ? `${testId}:error` : undefined}
        >
          {errorText}
        </Text>
      )}
    </>
  );
};
