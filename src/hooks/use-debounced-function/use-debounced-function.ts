import { useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Procedure = (...args: any[]) => void;

export const useDebouncedFunction = <F extends Procedure>(func: F, delay: number): Procedure => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  useEffect(() => {
    clearTimer();

    return () => {
      clearTimer();
    };
  }, []);

  return (...args) => {
    clearTimer();
    timeoutRef.current = setTimeout(() => func(...args), delay);
  };
};
