import React from 'react';
import { render, RenderResult } from '@testing-library/react';

import { InputObserver, useBrowserTabActivity } from './use-browser-tab-activity';

type ComponentProps = {
  observer: InputObserver;
};

const eventNamesMap = {
  focus: ['onFocus', 'onActivated'],
  blur: ['onBlur', 'onDeactivated'],
};

const TestComponent = (props: ComponentProps): React.ReactElement | null => {
  useBrowserTabActivity(props.observer);

  return <div>test-component</div>;
};

const changeVisibilityState = (state: VisibilityState): void => {
  Object.defineProperty(global.document, 'visibilityState', {
    value: state,
    configurable: true,
  });
  global.document.dispatchEvent(new Event('visibilitychange'));
};

afterEach(() => {
  jest.clearAllMocks();
  changeVisibilityState('visible');
});

const renderComponent = (props: ComponentProps): RenderResult => {
  return render(<TestComponent {...props} />);
};

describe('useBrowserTabActivity', () => {
  describe('срабатывание слушателей при изменении видимости таба', () => {
    test.each(['onVisible', 'onActivated'])('при становлении таба видимым вызывается %s', (key) => {
      const handleVisible = jest.fn();

      renderComponent({ observer: { [key]: handleVisible } });

      changeVisibilityState('visible');

      expect(handleVisible).toBeCalledTimes(1);
    });

    test.each(['onHidden', 'onDeactivated'])('при скрытии таба вызывается %s', (key) => {
      const handleHidden = jest.fn();

      renderComponent({ observer: { [key]: handleHidden } });

      changeVisibilityState('hidden');

      expect(handleHidden).toBeCalledTimes(1);
    });

    test.each(['onVisibilityChange', 'onActivityChange'])(
      'при смене состояния таба вызывается %s',
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

      test.each(eventNames)(`при событии ${eventName} вызывается %s`, (key) => {
        const handleEvent = jest.fn();

        renderComponent({ observer: { [key]: handleEvent } });

        global.dispatchEvent(new Event(eventName));

        expect(handleEvent).toBeCalledTimes(1);
      });

      test(`при событии ${eventName} вызывается onActivityChange`, () => {
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
