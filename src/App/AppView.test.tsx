import React from 'react';

import { mocks } from '../pages/projects/__mocks__/mocks';
import { render, screen, waitRequests } from '../testing';

import { AppView } from './AppView';

describe('AppView', () => {
  test('рендерится без ошибок', () => {
    expect(() => render(<AppView />)).not.toThrow();
  });

  test('рендерится приложение', async () => {
    render(<AppView />, { route: '/projects', mocks: mocks.default });

    await waitRequests();

    expect(await screen.getByLabelText('Расчётная платформа')).toBeInTheDocument();
  });
});
