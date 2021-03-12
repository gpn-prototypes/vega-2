import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { History } from 'history';

import { Bus } from '../../types/bus';
import { CurrentProject } from '../../types/current-project';
import { Notifications } from '../../types/notifications';
import { ServerError } from '../../types/shell';

import { AppProvider } from './app-context';
import { AppView } from './AppView';

import './App.css';

type AppProps = {
  currentProject: CurrentProject;
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  history: History;
  notifications: Notifications;
  bus: Bus;
  setServerError: (serverError: ServerError | null) => void;
};

export const App = (props: AppProps): React.ReactElement => {
  const { history, graphqlClient, ...shell } = props;

  return (
    <ApolloProvider client={graphqlClient}>
      <AppProvider {...shell}>
        <AppView history={history} />
      </AppProvider>
    </ApolloProvider>
  );
};
