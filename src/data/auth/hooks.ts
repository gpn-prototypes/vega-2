import { useCallback, useMemo, useReducer } from 'react';
import { useAPIClient } from '@vega/platform/api-client';

import { login as loginRequest } from './api';
import { reducer } from './reducer';
import { initialState, State } from './state';
import { Credentials } from './types';

export type AuthAPI = {
  isFetching: boolean;
  error: State['error'];
  login(data: Credentials): void;
  getCurrentUser(): void;
  logout(): void;
  isAuthorized?: boolean;
};

export const useAuth = (): AuthAPI => {
  const APIClient = useAPIClient();
  const [authData, updateAuthData] = useReducer(reducer, initialState);

  const isFetching = useMemo(() => authData.status === 'fetching', [authData]);

  const login = useCallback(
    async (data: Credentials) => {
      try {
        updateAuthData({ type: 'login' });
        const result = await loginRequest(APIClient, data);
        APIClient.setToken(result.token);
        updateAuthData({ type: 'success' });
      } catch (error) {
        updateAuthData({ type: 'error', payload: { error } });
      }
    },
    [APIClient],
  );

  // TODO: Добавить запрос на получение данных пользователя, когда его починят (сейчас редирект возвращает)
  const getCurrentUser = useCallback(() => {
    if (APIClient.getToken()) {
      updateAuthData({ type: 'success' });
    } else {
      updateAuthData({ type: 'logout' });
    }
  }, [APIClient]);

  // TODO: Добавить запрос нв logout, когда он появится
  const logout = useCallback(() => {
    updateAuthData({ type: 'logout' });
    APIClient.removeToken();
  }, [APIClient]);

  return {
    isFetching,
    error: authData.error,
    login,
    logout,
    isAuthorized: authData.isAuthorized,
    getCurrentUser,
  };
};
