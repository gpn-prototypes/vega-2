import React from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { MockedResponse, MockLink } from '@apollo/client/testing';
import {
  render as defaultRender,
  RenderOptions,
  RenderResult as RTLRenderResult,
} from '@testing-library/react';
import { createBrowserHistory } from 'history';

import { App, AppProvider } from '../App/app-context';

import { addCleanupTask } from './cleanup';
import { busMock, notificationsMock } from './mocks';

export * from '@testing-library/react';

interface RenderContext {
  app: App;
}

export type BeforeRenderFn = (context: RenderContext) => void;

export interface Options extends RenderOptions {
  route?: string;
  beforeRender?: BeforeRenderFn;
  mocks?: ReadonlyArray<MockedResponse>;
}

export interface RenderResult extends RTLRenderResult, RenderContext {
  cache: InMemoryCache;
}

export const createClient = (
  cache: InMemoryCache,
  mocks?: ReadonlyArray<MockedResponse>,
): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    cache,
    link: mocks ? new MockLink(mocks) : createHttpLink({ uri: '/graphql' }),
  });
};

export const render = (ui: React.ReactElement, options: Options = {}): RenderResult => {
  const { route, beforeRender, mocks, ...rtlOptions } = options;

  if (route !== undefined) {
    window.history.pushState({}, 'Test page', route);
  }

  const cache = new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['vid'],
      },
    },
  });

  const client = createClient(cache, mocks);

  const app: App = {
    graphqlClient: client,
    setServerError: () => {},
    notifications: notificationsMock,
    bus: busMock,
    history: createBrowserHistory(),
  };

  if (beforeRender) {
    beforeRender({ app });
  }

  const dispose = () => {
    app.graphqlClient.clearStore();
    app.graphqlClient.stop();
  };

  const TestProviders: React.FC = ({ children }) => {
    return <AppProvider app={app}>{children}</AppProvider>;
  };

  addCleanupTask(() => {
    dispose();
  });

  return {
    app,
    cache,
    ...defaultRender(ui, {
      wrapper: TestProviders,
      baseElement: document.body,
      ...rtlOptions,
    }),
  };
};
