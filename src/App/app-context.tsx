import React, { useEffect, useState } from 'react';
import { Router } from 'react-router';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { History } from 'history';

import { Bus } from '../../types/bus';
import { CurrentProject, Project } from '../../types/current-project';
import { Notifications } from '../../types/notifications';
import { ServerError } from '../../types/shell';

export type App = {
  notifications: Notifications;
  currentProject: CurrentProject;
  bus: Bus;
  history: History;
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  setServerError: (serverError: ServerError | null) => void;
};

const AppContext = React.createContext<App | null>(null);

export const useApp = (): App => {
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

export const AppProvider: React.FC<App> = (props) => {
  const { children, ...app } = props;

  return (
    <AppContext.Provider value={app}>
      <ApolloProvider client={app.graphqlClient}>
        <Router history={app.history}>{children}</Router>
      </ApolloProvider>
    </AppContext.Provider>
  );
};
