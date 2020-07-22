import { AxiosError } from 'axios';

export type State = {
  authorized?: boolean;
  status: 'fetching' | 'success' | 'error';
  error: AxiosError | null;
};

export type Action =
  | { type: 'login' }
  | { type: 'logout' }
  | { type: 'error'; payload: { error: AxiosError } }
  | { type: 'success' };

export const initialState: State = {
  authorized: undefined,
  status: 'success',
  error: null,
};
