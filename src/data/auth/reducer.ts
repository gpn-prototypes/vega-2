import { Action, State } from './state';

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        status: 'fetching',
        error: null,
      };

    case 'logout':
      return {
        ...state,
        status: 'success',
        error: null,
        authorized: false,
      };

    case 'error':
      return {
        ...state,
        status: 'error',
        error: action.payload.error,
        authorized: false,
      };

    case 'success':
      return {
        ...state,
        status: 'success',
        error: null,
        authorized: true,
      };

    default:
      return state;
  }
};
