import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { GraphQLClient } from '@gpn-prototypes/vega-sdk';
import { History } from 'history';

import { AppView } from './AppView';

import './App.css';

type AppProps = {
  graphqlClient: GraphQLClient;
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
