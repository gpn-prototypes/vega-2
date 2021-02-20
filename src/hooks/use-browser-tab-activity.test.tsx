import React from 'react';
import { render, RenderResult } from '@testing-library/react';

import { changeVisibilityState } from '../../test-utils/change-visibility-state';

import { InputObserver, useBrowserTabActivity } from './use-browser-tab-activity';

type ComponentProps = {
  observer: InputObserver;
};

const eventNamesMap = {
  focus: { first: 'onFocus', second: 'onActivated' },
  blur: { first: 'onBlur', second: 'onDeactivated' },
};

const TestComponent = (props: ComponentProps): React.ReactElement | null => {
  useBrowserTabActivity(props.observer);

  return <div>test-component</div>;
};

afterEach(() => {
  jest.clearAllMocks();
  changeVisibilityState('visible');
});

const renderComponent = (props: ComponentProps): RenderResult => {
  return render(<TestComponent {...props} />);
};

enum ORDER {
  first = 'first',
  second = 'second',
  third = 'third',
  fourth = 'fourth',
}

describe('useBrowserTabActivity', () => {
  describe('срабатывание слушателей при изменении видимости таба', () => {
    test('при становлении таба видимым обработчики срабатывают в правильном порядке', () => {
      const calls: string[] = [];
      const onVisible = jest.fn(() => calls.push(ORDER.first));
      const onActivated = jest.fn(() => calls.push(ORDER.second));
      const onVisibilityChange = jest.fn(() => calls.push(ORDER.third));
      const onActivityChange = jest.fn(() => calls.push(ORDER.fourth));

      renderComponent({
        observer: { onVisible, onActivated, onVisibilityChange, onActivityChange },
      });

      changeVisibilityState('visible');

      expect(calls).toEqual([ORDER.first, ORDER.second, ORDER.third, ORDER.fourth]);
    });

    test('при скрытии таба обработчики срабатывают в правильном порядке', () => {
      const calls: string[] = [];
      const onHidden = jest.fn(() => calls.push(ORDER.first));
      const onDeactivated = jest.fn(() => calls.push(ORDER.second));
      const onVisibilityChange = jest.fn(() => calls.push(ORDER.third));
      const onActivityChange = jest.fn(() => calls.push(ORDER.fourth));
      renderComponent({
        observer: { onHidden, onDeactivated, onVisibilityChange, onActivityChange },
      });

      changeVisibilityState('hidden');

      expect(calls).toEqual([ORDER.first, ORDER.second, ORDER.third, ORDER.fourth]);
    });

    test.each(['onVisibilityChange', 'onActivityChange'])(
      'при смене состояния таба вызывается %s с корректными аргументами',
      (key) => {
        const handleVisibilityChange = jest.fn();

        renderComponent({ observer: { [key]: handleVisibilityChange } });

        changeVisibilityState('visible');

        expect(handleVisibilityChange).toBeCalledWith({
          visible: true,
          hidden: false,
          focus: true,
          blur: false,
        });

        changeVisibilityState('hidden');

        expect(handleVisibilityChange).toBeCalledWith({
          visible: false,
          hidden: true,
          focus: true,
          blur: false,
        });
      },
    );
  });

  describe.each(Object.keys(eventNamesMap))(
    'срабатывание слушателей при событии %s',
    (eventName) => {
      const eventNames = eventNamesMap[eventName as 'blur' | 'focus'];

      test(`при событии ${eventName} обработчики вызываются в правильном порядке`, () => {
        const calls: string[] = [];
        const handlers = {
          [eventNames.first]: jest.fn(() => calls.push(ORDER.first)),
          [eventNames.second]: jest.fn(() => calls.push(ORDER.second)),
          onActivityChange: jest.fn(() => calls.push(ORDER.third)),
        };

        renderComponent({ observer: { ...handlers } });

        global.dispatchEvent(new Event(eventName));

        expect(calls).toEqual([ORDER.first, ORDER.second, ORDER.third]);
      });

      test(`при событии ${eventName} вызывается onActivityChange с корректными аргументами`, () => {
        const handleActivityChange = jest.fn();

        renderComponent({ observer: { onActivityChange: handleActivityChange } });

        global.dispatchEvent(new Event(eventName));

        expect(handleActivityChange).toBeCalledWith({
          visible: true,
          hidden: false,
          blur: eventName === 'blur',
          focus: eventName === 'focus',
        });
      });
    },
  );

  test('функция-обозреватель вызывается при изменении состояния', () => {
    const handleActivityChange = jest.fn();

    renderComponent({ observer: handleActivityChange });

    changeVisibilityState('hidden');

    expect(handleActivityChange).toBeCalledTimes(1);

    global.dispatchEvent(new Event('focus'));

    expect(handleActivityChange).toBeCalledTimes(2);

    global.dispatchEvent(new Event('blur'));

    expect(handleActivityChange).toBeCalledTimes(3);
  });
});
