import React from 'react';
import { Button, Checkbox, Form, Logo, Text, TextField } from '@gpn-prototypes/vega-ui';

import { cnAuthForm } from './cn-auth-form';
import { GazpromLogo } from './GazpromLogo';

import './AuthForm.css';

export type State = {
  username: string;
  password: string;
  remember: boolean;
};

type TextFieldOnChangeArgs = {
  value: string | null;
  name?: string;
  e: React.ChangeEvent;
  id?: string | number;
};

type AuthFormProps = {
  onLogin: (state: State) => void;
  isFetching: boolean;
  containerClassName?: string;
  formClassName?: string;
};

const initialState: State = {
  username: '',
  password: '',
  remember: false,
};

export const AuthForm: React.FC<AuthFormProps> = (props) => {
  const { onLogin, isFetching, containerClassName, formClassName } = props;

  const [state, setState] = React.useState<State>(initialState);

  const handleSubmit = (event: React.FormEvent<Element>): void => {
    event.preventDefault();
    onLogin(state);
  };

  const handleChange = ({ value, name }: TextFieldOnChangeArgs): void => {
    if (name) {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  const handleChangeCheckbox = (): void => {
    setState({ ...state, remember: !state.remember });
  };

  return (
    <div className={cnAuthForm.mix(containerClassName)}>
      <div className={cnAuthForm('GazpromLogo')}>
        <GazpromLogo />
      </div>
      <Form onSubmit={handleSubmit} className={cnAuthForm('Form').mix(formClassName)}>
        <Logo className={cnAuthForm('Logo')} />
        <Form.Row>
          <Form.Field>
            <Form.Label htmlFor="username">
              <Text size="l" lineHeight="s" view="secondary">
                E-mail
              </Text>
            </Form.Label>
            <TextField
              id="username"
              name="username"
              type="email"
              value={state.username}
              onChange={handleChange}
              size="l"
              width="full"
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
              name="password"
              type="password"
              value={state.password}
              onChange={handleChange}
              size="l"
              width="full"
            />
          </Form.Field>
        </Form.Row>
        <Form.Row space="l">
          <Checkbox
            checked={state.remember}
            size="m"
            onChange={handleChangeCheckbox}
            label="Запомнить меня"
          />
        </Form.Row>
        <Form.Row space="xl">
          <Button loading={isFetching} label="Войти" size="l" width="full" />
        </Form.Row>
        <Form.Row className={cnAuthForm('Desc')}>
          <Text size="s" lineHeight="xs" view="secondary">
            Если вы забыли пароль, обратитесь в&nbsp;Службу технической поддержки
          </Text>
        </Form.Row>
      </Form>
    </div>
  );
};
