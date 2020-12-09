import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { History } from 'history';

import { AppView } from './AppView';

import './App.css';

type AppProps = {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  history: History;
};

export const App = (props: AppProps): React.ReactElement => {
  const { graphqlClient, history } = props;
  return (
    <ApolloProvider client={graphqlClient}>
      <AppView history={history} />
    </ApolloProvider>
  );
};
