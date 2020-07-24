import { useCallback, useMemo, useReducer } from 'react';
import { useHttpClient } from '@vega/platform/http-client';

import { login as loginRequest } from './api';
import { reducer } from './reducer';
import { initialState, State } from './state';
import { AuthData } from './types';

export type AuthAPI = {
  isFetching: boolean;
  error: State['error'];
  login(data: AuthData): void;
  getCurrentUser(): void;
  logout(): void;
  authorized?: boolean;
};

export const useAuth = (): AuthAPI => {
  const httpClient = useHttpClient();
  const [authData, updateAuthData] = useReducer(reducer, initialState);

  const isFetching = useMemo(() => authData.status === 'fetching', [authData]);

  const login = useCallback(
    async (data: AuthData) => {
      try {
        updateAuthData({ type: 'login' });
        const result = await loginRequest(httpClient, data);
        httpClient.setToken(result.token);
        updateAuthData({ type: 'success' });
      } catch (error) {
        updateAuthData({ type: 'error', payload: { error } });
      }
    },
    [httpClient],
  );

  // TODO: Добавить запрос на получение данных пользователя, когда его починят (сейчас редирект возвращает)
  const getCurrentUser = useCallback(() => {
    if (httpClient.getToken()) {
      updateAuthData({ type: 'success' });
    } else {
      updateAuthData({ type: 'logout' });
    }
  }, [httpClient]);

  // TODO: Добавить запрос нв logout, когда он появится
  const logout = useCallback(() => {
    updateAuthData({ type: 'logout' });
    httpClient.removeToken();
  }, [httpClient]);

  return {
    isFetching,
    error: authData.error,
    login,
    logout,
    authorized: authData.authorized,
    getCurrentUser,
  };
};
