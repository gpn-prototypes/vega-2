export const changeVisibilityState = (state: VisibilityState): void => {
  Object.defineProperty(global.document, 'visibilityState', {
    value: state,
    configurable: true,
  });
  global.document.dispatchEvent(new Event('visibilitychange'));
};
