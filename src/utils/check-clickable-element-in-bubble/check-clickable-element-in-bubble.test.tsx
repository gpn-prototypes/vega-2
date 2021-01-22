import React from 'react';
import * as tl from '@testing-library/react';

import { checkClickableElementInBubble } from './check-clickable-element-in-bubble';

function renderComponent(fn: (e: React.SyntheticEvent) => void): tl.RenderResult {
  return tl.render(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div data-testid="wrap" onClick={fn}>
      <header data-testid="header">
        <button data-testid="button" type="button">
          bt
        </button>
        <input type="text" data-testid="input" />
      </header>
      <div>
        <div data-testid="inner" />
      </div>
    </div>,
  );
}

describe('checkClickableElementInBubble', () => {
  let has = false;

  beforeEach(() => {
    has = false;
  });

  test('возвращает true если клик был по кнопке', () => {
    const func = (e: React.SyntheticEvent) => {
      has = checkClickableElementInBubble(e);
    };

    const component = renderComponent(func);

    tl.fireEvent.click(component.getByTestId('button'));

    expect(has).toBeTruthy();
  });

  test('возвращает false если клик был по div', () => {
    const func = (e: React.SyntheticEvent) => {
      has = checkClickableElementInBubble(e);
    };

    const component = renderComponent(func);

    tl.fireEvent.click(component.getByTestId('inner'));

    expect(has).toBeFalsy();
  });

  test('возвращает false если клик был по header', () => {
    const func = (e: React.SyntheticEvent) => {
      has = checkClickableElementInBubble(e);
    };

    const component = renderComponent(func);

    tl.fireEvent.click(component.getByTestId('header'));

    expect(has).toBeFalsy();
  });

  test('возвращает true если клик был по input', () => {
    const func = (e: React.SyntheticEvent) => {
      has = checkClickableElementInBubble(e);
    };

    const component = renderComponent(func);

    tl.fireEvent.click(component.getByTestId('input'));

    expect(has).toBeTruthy();
  });
});
