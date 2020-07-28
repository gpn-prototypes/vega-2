import React from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { TextField as VegaTextField } from '@gpn-prototypes/vega-ui';

type TextFieldProps = Omit<React.ComponentProps<typeof VegaTextField>, 'defaultValue'> &
  FieldProps<string, FieldRenderProps<string>>;

export const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <Field
      {...props}
      render={({ input, meta, ...rest }): React.ReactNode => (
        <VegaTextField
          {...rest}
          value={input.value}
          name={input.name}
          type={input.type}
          onChange={({ e }): void => input.onChange(e)}
          state={meta.error && meta.touched ? 'alert' : undefined}
          // @ts-expect-error
          onBlur={input.onBlur}
          // @ts-expect-error
          onFocus={input.onFocus}
        />
      )}
    />
  );
};
