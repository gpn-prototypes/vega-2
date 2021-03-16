import React from 'react';

import { render } from '../testing';

import { AppView } from './AppView';

describe('AppView', () => {
  test('рендерится без ошибок', () => {
    expect(() => render(<AppView />)).not.toThrow();
  });
});
