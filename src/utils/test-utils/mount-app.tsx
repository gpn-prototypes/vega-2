import React from 'react';
import { ApolloLink, from, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse, MockLink } from '@apollo/client/testing';
import * as tl from '@testing-library/react';

import { MergeLink } from '../../App/Link';

interface MountAppOptions {
  shouldAddToBody?: boolean;
  mocks?: MockedResponse[];
  link?: ApolloLink;
}

// Then, put this client in ApolloProvider
// Import the schema object from previous code snippet above

// Wherever we want a component to display mocked data
// MyComponent uses the Query component internally
export const mountApp = (node: React.ReactElement, options: MountAppOptions = {}) => {
  const mocks = options.mocks ? options.mocks : [];

  const cache = new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['id'],
      },
    },
  });

  const mockLink = new MockLink(mocks);

  const links = from([MergeLink({}), mockLink]);

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
