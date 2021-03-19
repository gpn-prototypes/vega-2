import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { render } from '@testing-library/react';
import { createBrowserHistory } from 'history';

import { busMock, createClient, notificationsMock } from './testing';
import App from './vega-sp';

jest.mock('systemjs-webpack-interop', () => {
  return {
    setPublicPath: jest.fn(),
  };
});

describe('App', () => {
  test('рендерится без ошибок', () => {
    expect(() =>
      render(
        <App
          currentProject={{ get: () => null }}
          notifications={notificationsMock}
          bus={busMock}
          graphqlClient={createClient(new InMemoryCache())}
          history={createBrowserHistory()}
          setServerError={() => {}}
        />,
      ),
    ).not.toThrow();
  });
});
