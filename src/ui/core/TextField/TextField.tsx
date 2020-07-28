import React from 'react';
import { Field } from 'react-final-form';
import { TextField as VegaTextField } from '@gpn-prototypes/vega-ui';

type TextFieldProps = React.ComponentProps<typeof VegaTextField> & {
  validate?: (value: string) => string | undefined;
  name: string;
};

export const TextField: React.FC<TextFieldProps> = (props) => {
  const { validate, ...inputProps } = props;

  const onValidate = (value: string | string[] | number | undefined | null): string | undefined => {
    if (typeof value === 'string' && validate) {
      return validate(value);
    }

    return undefined;
  };

  return (
    <Field
      {...inputProps}
      validate={onValidate}
      render={({ input, meta, ...rest }): React.ReactNode => (
        <VegaTextField
          {...rest}
          value={input.value as string | undefined}
          name={input.name}
          type={input.type}
          onChange={({ e }): void => input.onChange(e)}
          state={meta.error ? 'alert' : undefined}
          // @ts-expect-error
          onBlur={input.onBlur}
          // @ts-expect-error
          onFocus={input.onFocus}
        />
      )}
    />
  );
};
