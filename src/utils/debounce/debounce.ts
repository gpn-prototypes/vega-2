// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Procedure = (...args: any[]) => void;

export const debounce = <F extends Procedure>(func: F, wait: number): Procedure => {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
