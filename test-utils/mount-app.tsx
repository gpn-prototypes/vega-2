import React from 'react';
import { Router } from 'react-router-dom';
import { ApolloLink, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';

import { AppProvider } from '../src/App/app-context';
import { Bus } from '../types/bus';
import { CurrentProject } from '../types/current-project';
import { Notifications } from '../types/notifications';

import { busMock } from './mocks/busMock';
import { notificationsMock } from './mocks/notificationsMock';

type MountAppOptions = {
  shouldAddToBody?: boolean;
  mocks?: MockedResponse[];
  link?: ApolloLink;
  url?: string;
  notifications?: Notifications;
  bus?: Bus;
  currentProject?: CurrentProject;
};

export type MountAppResult = {
  $: RenderResult;
  cache: InMemoryCache;
  waitRequest(amount?: number): Promise<void>;
  history: MemoryHistory;
  notifications: Notifications;
  currentProject: CurrentProject;
};

export const mountApp = (
  node: React.ReactElement,
  options: MountAppOptions = {},
): MountAppResult => {
  const history = createMemoryHistory();
  const notifications = options.notifications ?? notificationsMock;
  const bus = options.bus ?? busMock;
  const currentProject = options.currentProject ?? {
    get: () => null,
  };

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
          <AppProvider
            currentProject={currentProject}
            notifications={notifications}
            bus={bus}
            setServerError={() => {}}
          >
            <>{props.children}</>
          </AppProvider>
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
    notifications,
    history,
    currentProject,
  };
};
