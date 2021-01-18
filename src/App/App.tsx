import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { History } from 'history';

import { Bus } from '../../types/bus';
import { Notifications } from '../../types/notifications';
import { BusProvider, NotificationsProvider } from '../providers';

import { AppView } from './AppView';

import './App.css';

type AppProps = {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  history: History;
  notifications?: Notifications;
  bus: Bus;
};

export const App = (props: AppProps): React.ReactElement => {
  const { graphqlClient, notifications, history, bus } = props;

  return (
    <ApolloProvider client={graphqlClient}>
      <NotificationsProvider notifications={notifications}>
        <BusProvider bus={bus}>
          <AppView history={history} />
        </BusProvider>
      </NotificationsProvider>
    </ApolloProvider>
  );
};
