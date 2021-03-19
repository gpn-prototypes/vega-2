import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, RenderResult } from '../../testing';

import { hasNestedInteractiveTarget } from './has-nested-interactive-target';

function renderComponent(fn: (e: React.SyntheticEvent) => void): RenderResult {
  return render(
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

describe('hasNestedInteractiveTarget', () => {
  let has = false;

  beforeEach(() => {
    has = false;
  });

  test('возвращает true если клик был по кнопке', () => {
    const func = (e: React.SyntheticEvent) => {
      has = hasNestedInteractiveTarget(e);
    };

    const component = renderComponent(func);

    userEvent.click(component.getByTestId('button'));

    expect(has).toBeTruthy();
  });

  test('возвращает false если клик был по div', () => {
    const func = (e: React.SyntheticEvent) => {
      has = hasNestedInteractiveTarget(e);
    };

    const component = renderComponent(func);

    userEvent.click(component.getByTestId('inner'));

    expect(has).toBeFalsy();
  });

  test('возвращает false если клик был по header', () => {
    const func = (e: React.SyntheticEvent) => {
      has = hasNestedInteractiveTarget(e);
    };

    const component = renderComponent(func);

    userEvent.click(component.getByTestId('header'));

    expect(has).toBeFalsy();
  });

  test('возвращает true если клик был по input', () => {
    const func = (e: React.SyntheticEvent) => {
      has = hasNestedInteractiveTarget(e);
    };

    const component = renderComponent(func);

    userEvent.click(component.getByTestId('input'));

    expect(has).toBeTruthy();
  });
});
