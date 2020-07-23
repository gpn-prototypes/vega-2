import React from 'react';
import { useAuth } from '@vega/data/auth';

import { AppContext } from './AppContext';

type AppStoreProviderProps = {
  children: React.ReactNode;
};

export const AppStoreProvider: React.FC<AppStoreProviderProps> = (props) => {
  const { children } = props;

  const authAPI = useAuth();

  return <AppContext.Provider value={{ authAPI }}>{children}</AppContext.Provider>;
};
