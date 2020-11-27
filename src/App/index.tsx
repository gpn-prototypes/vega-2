import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { createBrowserHistory } from 'history';

import { App } from './App';

import './App.css';

const authToken = localStorage.getItem('auth-token');

/*

  В будущем можно использовать глобальное переопределение идентификатора на "vid":
  https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-identifier-generation-globally

  Объекты: Region, Country

*/

const history = createBrowserHistory();

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['vid'],
      },
    },
  }),
  link: new HttpLink({
    uri: process.env.BASE_API_URL,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : undefined,
    },
  }),
});

ReactDOM.render(<App history={history} graphqlClient={client} />, document.getElementById('root'));
