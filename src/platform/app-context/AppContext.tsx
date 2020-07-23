import { createContext, useContext } from 'react';
import { AuthAPI } from '@vega/data/auth';

type AppContext = {
  authAPI: AuthAPI;
};

export const AppContext = createContext<AppContext>({
  authAPI: {
    isFetching: false,
    error: null,
    login: (): void => {},
    logout: (): void => {},
    getCurrentUser: (): void => {},
  },
});

export const useAppContext = (): AppContext => useContext(AppContext);
