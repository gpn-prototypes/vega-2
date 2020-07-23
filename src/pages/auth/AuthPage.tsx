import * as React from 'react';
import { Button, Carousel, Checkbox, Form, Logo, Text, TextField } from '@gpn-prototypes/vega-ui';
import { useAppContext } from '@vega/platform/app-context';

import { cnAuthPage } from './cn-auth-page';
import { GazpromLogo } from './GazpromLogo';

import './AuthPage.css';

type State = {
  login: Value;
  password: Value;
  remember?: boolean;
};

type Value = string | null | undefined;

type TextFieldOnChangeArgs = {
  value: string | null;
  name?: string;
  e: React.ChangeEvent;
  id?: string | number;
};

const initialState = {
  login: '',
  password: '',
  remember: false,
};

export const AuthPage: React.FC = () => {
  const [state, setState] = React.useState<State>(initialState);
  const [idx, setIdx] = React.useState(0);
  const { authAPI } = useAppContext();
  const { isFetching, login } = authAPI;

  const handleSubmit = (event: React.FormEvent<Element>): void => {
    event.preventDefault();
    if (typeof state.login === 'string' && typeof state.password === 'string') {
      login({ login: state.login, password: state.password });
    }
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

  const firstSlideCaption = 'Какой-то текст про Вега 2.0.';

  const secondSlideCaption =
    'Какой-то текст про то, какие задачи можно очень круто и быстро решать с помощью Веги 2.0.';

  return (
    <div className={cnAuthPage()}>
      <div className={cnAuthPage('FormSection')}>
        <div className={cnAuthPage('GazpromLogo')}>
          <GazpromLogo />
        </div>
        <Form onSubmit={handleSubmit} className={cnAuthPage('Form')}>
          <Logo className={cnAuthPage('Logo')} />
          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor="login">
                <Text size="l" lineHeight="s" view="secondary">
                  E-mail
                </Text>
              </Form.Label>
              <TextField
                id="login"
                name="login"
                type="email"
                value={state.login}
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
          <Form.Row className={cnAuthPage('FormDesc')}>
            <Text size="s" lineHeight="xs" view="secondary">
              Если вы забыли пароль, обратитесь в&nbsp;Службу технической поддержки
            </Text>
          </Form.Row>
        </Form>
      </div>
      <div className={cnAuthPage('Teaser')}>
        <Carousel currentIdx={idx} onChange={setIdx} className={cnAuthPage('TeaserCarousel')}>
          <Carousel.Slide caption={firstSlideCaption} className={cnAuthPage('Slide')}>
            <Text size="xl">Ведутся работы...</Text>
          </Carousel.Slide>
          <Carousel.Slide caption={secondSlideCaption} className={cnAuthPage('Slide')}>
            <Text size="xl">А здесь мы вам расскажем о возможностях системы</Text>
          </Carousel.Slide>
        </Carousel>
      </div>
    </div>
  );
};
