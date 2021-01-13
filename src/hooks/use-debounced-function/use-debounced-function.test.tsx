import React from 'react';
import * as tl from '@testing-library/react';

import { useDebouncedFunction } from './use-debounced-function';

function Component({ text, func, delay }: { text: string; func: VoidFunction; delay: number }) {
  const debounced = useDebouncedFunction(func, delay);

  debounced();
  return <span>{text}</span>;
}

describe('useDebouncedFunction', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('функция срабатывает через заданное время', () => {
    const func = jest.fn();

    const component = tl.render(<Component text="step 1" func={func} delay={100} />);

    expect(func).not.toBeCalled();
    jest.runTimersToTime(50);
    component.rerender(<Component text="step 2" func={func} delay={100} />);
    component.rerender(<Component text="step 3" func={func} delay={100} />);
    expect(func).not.toBeCalled();

    jest.runTimersToTime(100);
    component.rerender(<Component text="step 4" func={func} delay={100} />);
    expect(func).toBeCalled();
    expect(func.mock.calls.length).toBe(1);

    jest.runTimersToTime(50);
    component.rerender(<Component text="step 5" func={func} delay={100} />);
    expect(func.mock.calls.length).toBe(1);

    jest.runTimersToTime(200);
    component.rerender(<Component text="step 6" func={func} delay={100} />);
    expect(func.mock.calls.length).toBe(2);
  });

  it('функция не срабатывает после unmount', () => {
    const func = jest.fn();

    const component = tl.render(<Component text="step 1" func={func} delay={100} />);

    expect(func).not.toBeCalled();

    jest.runTimersToTime(50);
    component.rerender(<Component text="step 2" func={func} delay={100} />);
    expect(func).not.toBeCalled();

    jest.runTimersToTime(100);
    component.rerender(<Component text="step 3" func={func} delay={100} />);
    expect(func).toBeCalled();
    expect(func.mock.calls.length).toBe(1);

    jest.runTimersToTime(50);
    component.rerender(<Component text="step 4" func={func} delay={100} />);
    expect(func.mock.calls.length).toBe(1);

    component.rerender(<Component text="step 5" func={func} delay={100} />);
    component.unmount();
    jest.runTimersToTime(200);
    expect(func.mock.calls.length).toBe(1);
  });

  it('срабатывает новая переданная функция', () => {
    const func = jest.fn();
    const cb = jest.fn();

    const component = tl.render(<Component text="step 1" func={func} delay={100} />);

    expect(func).not.toBeCalled();
    expect(cb).not.toBeCalled();

    jest.runTimersToTime(50);
    component.rerender(<Component text="step 2" func={func} delay={100} />);
    expect(func).not.toBeCalled();

    jest.runTimersToTime(100);
    component.rerender(<Component text="step 3" func={func} delay={100} />);
    expect(func).toBeCalled();
    expect(func.mock.calls.length).toBe(1);

    jest.runTimersToTime(50);
    component.rerender(<Component text="step 4" func={cb} delay={100} />);
    expect(cb).not.toBeCalled();

    jest.runTimersToTime(100);
    component.rerender(<Component text="step 5" func={cb} delay={100} />);
    expect(func.mock.calls.length).toBe(1);
    expect(cb.mock.calls.length).toBe(1);

    jest.runTimersToTime(100);
    component.rerender(<Component text="step 6" func={cb} delay={100} />);
    expect(func.mock.calls.length).toBe(1);
    expect(cb.mock.calls.length).toBe(2);
  });
});
