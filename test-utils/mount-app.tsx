import React from 'react';
import { Router } from 'react-router-dom';
import { ApolloLink, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';

import { NotificationsProvider } from '../src/providers';
import { Notifications } from '../types/notifications';

type MountAppOptions = {
  shouldAddToBody?: boolean;
  mocks?: MockedResponse[];
  link?: ApolloLink;
  url?: string;
  notifications?: Notifications;
};

type MountAppResult = {
  $: RenderResult;
  cache: InMemoryCache;
  waitRequest(amount?: number): Promise<void>;
  history: MemoryHistory;
};

export const mountApp = (
  node: React.ReactElement,
  options: MountAppOptions = {},
): MountAppResult => {
  const history = createMemoryHistory();

  if (options.url) {
    history.push(options.url);
  }

  const mocks = options.mocks ? options.mocks : [];

  const cache = new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['vid'],
      },
    },
  });

  const TestApp: React.FC = (props) => {
    return (
      <Router history={history}>
        <MockedProvider mocks={mocks} addTypename cache={cache}>
          <NotificationsProvider notifications={options.notifications}>
            <>{props.children}</>
          </NotificationsProvider>
        </MockedProvider>
      </Router>
    );
  };

  const renderResult = render(node, {
    wrapper: TestApp,
    baseElement: document.body,
  });

  // istanbul ignore next
  if (!renderResult) {
    throw new Error('отсутствует результат рендеринга');
  }

  async function actWait(amount = 0) {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, amount));
    });
  }

  return {
    $: renderResult,
    waitRequest: actWait,
    cache,
    history,
  };
};
