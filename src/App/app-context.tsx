import React, { useEffect, useState } from 'react';

import { Bus } from '../../types/bus';
import { CurrentProject, Project } from '../../types/current-project';
import { Notifications } from '../../types/notifications';
import { ServerError } from '../../types/shell';

type AppProviderProps = {
  currentProject: CurrentProject;
  notifications: Notifications;
  bus: Bus;
  setServerError: (serverError: ServerError | null) => void;
};

type AppContextProps = {
  currentProject: CurrentProject;
  notifications: Notifications;
  bus: Bus;
  setServerError: (serverError: ServerError | null) => void;
};

const AppContext = React.createContext<AppContextProps | null>(null);

export const useApp = (): AppContextProps => {
  const app = React.useContext(AppContext);

  if (app === null) {
    throw new Error('useApp called outside from AppProvider');
  }

  return app;
};

export function useCurrentProjectParams(): Project {
  const { currentProject, bus } = useApp();
  const [params, setParams] = useState(() => currentProject.get());

  if (params === null) {
    throw new Error('Current project is not setup');
  }

  useEffect(
    () =>
      bus.subscribe({ channel: 'project', topic: 'status' }, () => {
        setParams(currentProject.get());
      }),
    [currentProject, bus, params],
  );

  return params;
}

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const { children, ...shell } = props;

  return <AppContext.Provider value={{ ...shell }}>{children}</AppContext.Provider>;
};
