import { AxiosError } from 'axios';

export type State = {
  isAuthorized?: boolean;
  status: 'fetching' | 'success' | 'error';
  error: AxiosError | null;
};

export type Action =
  | { type: 'login' }
  | { type: 'logout' }
  | { type: 'error'; payload: { error: AxiosError } }
  | { type: 'success' };

export const initialState: State = {
  isAuthorized: undefined,
  status: 'success',
  error: null,
};
