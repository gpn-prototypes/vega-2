import React from 'react';

import { render } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  test('корректно рендерится', () => {
    const { getByText } = render(<App />);
    expect(getByText('i am button')).toBeInTheDocument();
  });
});