import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { History } from 'history';

import { Notifications } from '../../types/notifications';
import { NotificationsProvider } from '../providers';

import { AppView } from './AppView';

import './App.css';

type AppProps = {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  history: History;
  notifications?: Notifications;
};

export const App = (props: AppProps): React.ReactElement => {
  const { graphqlClient, notifications, history } = props;

  return (
    <ApolloProvider client={graphqlClient}>
      <NotificationsProvider notifications={notifications}>
        <AppView history={history} />
      </NotificationsProvider>
    </ApolloProvider>
  );
};
