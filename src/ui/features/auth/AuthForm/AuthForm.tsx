import React from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { Button, Checkbox, Form, Logo, Text } from '@gpn-prototypes/vega-ui';
import { TextField } from '@vega/ui/core';
import { createValidate, validators } from '@vega/ui/forms/validation';

import { cnAuthForm } from './cn-auth-form';
import { GazpromLogo } from './GazpromLogo';

import './AuthForm.css';

export type State = {
  login: string;
  password: string;
  remember: boolean;
};

export type AuthFormProps = {
  onLogin: (state: State) => void;
  isFetching?: boolean;
  containerClassName?: string;
  formClassName?: string;
};

const validator = createValidate<Partial<State>>({
  login: [validators.required(), validators.email()],
  password: [validators.required()],
});

type ValidateMap = ReturnType<typeof validator>;
const testId = {
  form: 'AuthForm:form',
  loginInput: 'AuthForm:loginInput',
  passwordInput: 'AuthForm:passwordInput',
  submit: 'AuthForm:submit',
};

type AuthFormComponent = React.FC<AuthFormProps> & {
  testID: typeof testId;
};

export const AuthForm: AuthFormComponent = (props) => {
  const { onLogin, isFetching, containerClassName, formClassName } = props;

  const handleAuthSubmit = (values: State): void => {
    onLogin(values);
  };

  const validate = (values: State): ValidateMap => validator(values);

  return (
    <div className={cnAuthForm.mix(containerClassName)}>
      <div className={cnAuthForm('GazpromLogo')}>
        <GazpromLogo />
      </div>
      <FinalForm onSubmit={handleAuthSubmit} validate={validate}>
        {({ handleSubmit }): React.ReactNode => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            data-testid={testId.form}
            className={cnAuthForm('Form').mix(formClassName)}
          >
            <Logo className={cnAuthForm('Logo')} />
            <Form.Row>
              <Form.Field>
                <Form.Label htmlFor="login">
                  <Text size="l" lineHeight="s" view="secondary">
                    E-mail
                  </Text>
                </Form.Label>
                <TextField
                  name="login"
                  id="login"
                  type="email"
                  size="l"
                  data-testid={testId.loginInput}
                  width="full"
                  maxLength={128}
                  validateOnTouched
                />
              </Form.Field>
            </Form.Row>
            <Form.Row space="m">
              <Form.Field>
                <Form.Label htmlFor="password" size="l">
                  <Text size="l" lineHeight="s" view="secondary">
                    Пароль
                  </Text>
                </Form.Label>
                <TextField
                  id="password"
                  type="password"
                  name="password"
                  size="l"
                  width="full"
                  data-testid={testId.passwordInput}
                  maxLength={200}
                  validateOnTouched
                />
              </Form.Field>
            </Form.Row>
            <Form.Row space="l">
              <Field id="remember" name="remember" type="checkbox">
                {({ input }): React.ReactNode => (
                  <Checkbox
                    {...input}
                    checked={Boolean(input.checked)}
                    onChange={({ e }): void => input.onChange(e)}
                    size="m"
                    label="Запомнить меня"
                  />
                )}
              </Field>
            </Form.Row>
            <Form.Row space="xl">
              <Button
                data-testid={testId.submit}
                loading={isFetching}
                label="Войти"
                size="l"
                width="full"
              />
            </Form.Row>
            <Form.Row className={cnAuthForm('Desc')}>
              <Text size="s" lineHeight="xs" view="secondary">
                Если вы забыли пароль, обратитесь в&nbsp;Службу технической поддержки
              </Text>
            </Form.Row>
          </Form>
        )}
      </FinalForm>
    </div>
  );
};

AuthForm.testID = testId;
