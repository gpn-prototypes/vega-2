import { debounce } from './debounce';

describe('debounce', () => {
  it('функция срабатывает заданное количество раз', () => {
    jest.useFakeTimers();

    const func = jest.fn();
    const debouncedFunction = debounce(func, 100);

    debouncedFunction();
    expect(func).not.toBeCalled();

    jest.runTimersToTime(50);
    expect(func).not.toBeCalled();

    jest.runTimersToTime(100);
    expect(func).toBeCalled();
    expect(func.mock.calls.length).toBe(1);
  });
});
