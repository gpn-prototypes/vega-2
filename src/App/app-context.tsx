import React from 'react';

import { Bus } from '../../types/bus';
import { Notifications } from '../../types/notifications';
import { ServerError } from '../../types/shell';

type AppProviderProps = {
  notifications: Notifications;
  bus: Bus;
  setServerError: (serverError: ServerError | null) => void;
};

type AppContextProps = {
  notifications: Notifications;
  bus: Bus;
  setServerError: (serverError: ServerError | null) => void;
};

const AppContext = React.createContext<AppContextProps | null>(null);

export const useApp = () => {
  const app = React.useContext(AppContext);

  if (app === null) {
    throw new Error('useApp called outside from AppProvider');
  }

  return app;
};

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const { children, ...shell } = props;

  return <AppContext.Provider value={{ ...shell }}>{children}</AppContext.Provider>;
};
