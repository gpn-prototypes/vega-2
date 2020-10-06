import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';

import { AppView } from './AppView';

import './App.css';

type AppProps = {
  client: ApolloClient<NormalizedCacheObject>;
};

export const App = (props: AppProps): React.ReactElement => {
  const { client } = props;
  return (
    <ApolloProvider client={client}>
      <AppView />
    </ApolloProvider>
  );
};
