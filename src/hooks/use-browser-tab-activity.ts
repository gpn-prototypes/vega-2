import { useEffect, useRef } from 'react';
import { merge } from 'ramda';

const noop = () => {};

export interface State {
  visible: boolean;
  hidden: boolean;
  focus: boolean;
  blur: boolean;
}

export interface InnerState {
  visible: boolean;
  active: boolean;
}

export interface Observer {
  onVisible(): void;
  onHidden(): void;
  onActivated(): void;
  onDeactivated(): void;
  onFocus(): void;
  onBlur(): void;
  onVisibilityChange(state: State): void;
  onActivityChange(state: State): void;
}

const withDefaulHandlers = merge({
  onVisible: noop,
  onHidden: noop,
  onFocus: noop,
  onBlur: noop,
  onActivated: noop,
  onDeactivated: noop,
  onActivityChange: noop,
  onVisibilityChange: noop,
});

export type InputObserver = Partial<Observer> | VoidFunction;

const defaultObserver = withDefaulHandlers({});

export function useObserverRef(observer: InputObserver): React.MutableRefObject<Observer> {
  const result = useRef<Observer>(defaultObserver);

  result.current =
    typeof observer !== 'function'
      ? withDefaulHandlers(observer)
      : withDefaulHandlers({ onActivityChange: observer });

  return result;
}

function computeState(state: InnerState): State {
  return {
    visible: state.visible,
    hidden: !state.visible,
    focus: state.active,
    blur: !state.active,
  };
}

export function useBrowserTabActivity(inputObserver: InputObserver): void {
  const stateRef = useRef<InnerState>({
    visible: true,
    active: true,
  });

  const observerRef = useObserverRef(inputObserver);

  useEffect(() => {
    function focusListener() {
      stateRef.current.active = true;
      const state = computeState(stateRef.current);
      observerRef.current.onFocus();
      observerRef.current.onActivated();
      observerRef.current.onActivityChange(state);
    }

    function blurListener() {
      stateRef.current.active = false;
      const state = computeState(stateRef.current);

      observerRef.current.onBlur();
      observerRef.current.onDeactivated();
      observerRef.current.onActivityChange(state);
    }

    function visibilityListener() {
      stateRef.current.visible = document.visibilityState === 'visible';
      const state = computeState(stateRef.current);

      if (stateRef.current.visible) {
        observerRef.current.onVisible();
        observerRef.current.onActivated();
      } else {
        observerRef.current.onHidden();
        observerRef.current.onDeactivated();
      }

      observerRef.current.onVisibilityChange(state);
      observerRef.current.onActivityChange(state);
    }

    document.addEventListener('visibilitychange', visibilityListener);
    window.addEventListener('focus', focusListener);
    window.addEventListener('blur', blurListener);

    return () => {
      document.removeEventListener('visibilitychange', visibilityListener);
      window.removeEventListener('focus', focusListener);
      window.removeEventListener('blur', blurListener);
    };
  }, [observerRef]);
}
