import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloLink, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import * as tl from '@testing-library/react';

type MountAppOptions = {
  shouldAddToBody?: boolean;
  mocks?: MockedResponse[];
  link?: ApolloLink;
  route?: string;
};

type MountAppResult = {
  $: tl.RenderResult;
  cache: InMemoryCache;
  waitRequest(amount?: number): Promise<void>;
};

export const mountApp = (
  node: React.ReactElement,
  options: MountAppOptions = {},
): MountAppResult => {
  if (options.route) {
    window.history.pushState({}, '', options.route);
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
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename cache={cache}>
          <>{props.children}</>
        </MockedProvider>
      </BrowserRouter>
    );
  };

  const renderResult = tl.render(node, {
    wrapper: TestApp,
    baseElement: document.body,
  });

  // istanbul ignore next
  if (!renderResult) {
    throw new Error('отсутствует результат рендеринга');
  }

  async function actWait(amount = 0) {
    await tl.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, amount));
    });
  }

  return {
    $: renderResult,
    waitRequest: actWait,
    cache,
  };
};
