import * as React from 'react';
import { Button, Form, Text, TextField } from '@gpn-prototypes/vega-ui';

import { cnAuthPage } from './cn-auth-page';

export const AuthPage: React.FC = () => {
  return (
    <div className={cnAuthPage()}>
      <div className={cnAuthPage('FormSection')}>
        {/* <Logo /> */}
        <Form>
          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <TextField id="email" />
            </Form.Field>
          </Form.Row>
          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor="password">Пароль</Form.Label>
              <TextField id="password" />
            </Form.Field>
          </Form.Row>
          <Form.Row>
            {/* <Checkbox checked={false} onChange={() => {}} label="Запомнить меня" /> */}
          </Form.Row>
          <Form.Row>
            <Button label="Войти" />
          </Form.Row>
          <Form.Row>
            <Text>Если вы забыли пароль, обратитесь в&nbsp;Службу технической поддержки</Text>
          </Form.Row>
        </Form>
      </div>
      <div className={cnAuthPage('Teaser')}>s</div>
    </div>
  );
};
