import React from 'react';
import { ApolloLink, from, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse, MockLink } from '@apollo/client/testing';
import * as tl from '@testing-library/react';

type MountAppOptions = {
  shouldAddToBody?: boolean;
  mocks?: MockedResponse[];
  link?: ApolloLink;
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
  const mocks = options.mocks ? options.mocks : [];

  const cache = new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['id'],
      },
      User: {
        keyFields: ['id'],
      },
    },
  });

  const mockLink = new MockLink(mocks);

  const links = options.link ? from([options.link, mockLink]) : from([mockLink]);

  const TestApp: React.FC = (props) => {
    return (
      <MockedProvider mocks={mocks} addTypename cache={cache} link={links}>
        <>{props.children}</>
      </MockedProvider>
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
