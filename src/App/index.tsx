import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';

import { App } from './App';
import { MergeLink } from './Link';

import './App.css';

const httpLink = new HttpLink({
  uri: 'http://outsourcing.nat.tepkom.ru:38080/graphql',
  headers: {
    Authorization: localStorage.getItem('auth-token')
      ? `Bearer ${localStorage.getItem('auth-token')}`
      : undefined,
  },
});

const links = from([new MergeLink(), httpLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: links,
});

ReactDOM.render(<App graphqlClient={client} />, document.getElementById('root'));
