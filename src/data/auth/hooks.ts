import { useCallback, useReducer } from 'react';
import { useHttpClient } from '@vega/platform/http-client';

import { auth as authRequest } from './api';
import { reducer } from './reducer';
import { initialState, State } from './state';
import { AuthData } from './types';

type AuthAPI = {
  isFetching: boolean;
  error: State['error'];
  login(data: AuthData): void;
  logout(): void;
};

export const useAuth = (): AuthAPI => {
  const httpClient = useHttpClient();
  const [authData, updateAuthData] = useReducer(reducer, initialState);

  const isFetching = authData.status === 'fetching';

  const login = useCallback(
    async (data: AuthData) => {
      try {
        updateAuthData({ type: 'login' });
        const result = await authRequest(httpClient, data);
        httpClient.setToken(result.token);
        updateAuthData({ type: 'success' });
      } catch (error) {
        updateAuthData({ type: 'error', payload: { error } });
      }
    },
    [httpClient],
  );

  const logout = useCallback(() => {
    updateAuthData({ type: 'logout' });
    httpClient.removeToken();
  }, [httpClient]);

  return {
    isFetching,
    error: authData.error,
    login,
    logout,
  };
};
