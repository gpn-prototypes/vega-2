import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { App } from './App';

import './App.css';

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['vid'],
      },
    },
  }),
  link: new HttpLink({
    uri: 'http://outsourcing.nat.tepkom.ru:38080/graphql',
    headers: {
      Authorization: localStorage.getItem('auth-token')
        ? `Bearer ${localStorage.getItem('auth-token')}`
        : undefined,
    },
  }),
});

ReactDOM.render(<App graphqlClient={client} />, document.getElementById('root'));
