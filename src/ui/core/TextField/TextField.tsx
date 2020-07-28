import React from 'react';
import { Field } from 'react-final-form';
import { TextField as VegaTextField } from '@gpn-prototypes/vega-ui';

type TextFieldProps = React.ComponentProps<typeof VegaTextField> & {
  name: string;
};

export const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <Field
      {...props}
      render={({ input, ...rest }): React.ReactNode => (
        <VegaTextField
          {...rest}
          value={input.value as string | undefined}
          name={input.name}
          type={input.type}
          onChange={({ e }): void => input.onChange(e)}
          // @ts-expect-error
          onBlur={input.onBlur}
          // @ts-expect-error
          onFocus={input.onFocus}
        />
      )}
    />
  );
};
