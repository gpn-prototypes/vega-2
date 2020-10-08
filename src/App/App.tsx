import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';

import { AppView } from './AppView';

import './App.css';

type AppProps = {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
};

export const App = (props: AppProps): React.ReactElement => {
  const { graphqlClient } = props;

  return (
    <ApolloProvider client={graphqlClient}>
      <AppView />
    </ApolloProvider>
  );
};
