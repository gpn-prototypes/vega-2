import * as React from 'react';
import { InMemoryCache, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import * as tl from '@testing-library/react';

import { UPDATE_PROJECT_MUTATION } from './__mock__/mutation';
import { GET_PROJECTS_QUERY } from './__mock__/query';
import { QueryWithMerge } from './query-with-merge';

const mock = [
  {
    request: {
      query: GET_PROJECTS_QUERY,
    },
    result: {
      data: {
        project: {
          id: 1,
          name: 'name 1',
          description: 'description 1',
          status: 'draft',
          version: 1,
          // __typename: 'Project',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_PROJECT_MUTATION,
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    },
    result: {
      data: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 2,
          // __typename: 'Project',
        },
      },
    },
  },
];

// type TestAppProps = {
//   children: React.ReactNode;
// };

interface MountAppOptions {
  shouldAddToBody?: boolean;
  mocks?: MockedResponse[];
}

async function mountApp(node: React.ReactElement, options: MountAppOptions = {}) {
  const mocks = options.mocks ? options.mocks : undefined;

  const cache = new InMemoryCache({
    typePolicies: {
      Project: {
        keyFields: ['id'],
      },
    },
  });

  const TestApp: React.FC = (props) => {
    return (
      <MockedProvider mocks={mocks} cache={cache}>
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
}

const App = () => {
  const client = useApolloClient();

  const { data } = useQuery(GET_PROJECTS_QUERY);
  const [mut] = useMutation(UPDATE_PROJECT_MUTATION, {
    update(cache, { data: { project } }) {
      cache.writeQuery({
        query: GET_PROJECTS_QUERY,
        data: { project },
      });
    },
  });

  const queryWithMerge = new QueryWithMerge({
    query: GET_PROJECTS_QUERY,
    mutation: UPDATE_PROJECT_MUTATION,
    client,
  });

  const onClick = () => {
    queryWithMerge.update({ project: { id: 1, name: 'new name' } });
  };

  return (
    <div>
      <button type="button" data-testid="updateData" onClick={onClick}>
        Изменить данные
      </button>
    </div>
  );
};

describe('QueryWithMerge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('рендерится без ошибок', async () => {
    const { $ } = await mountApp(<div data-testid="test" />, { mocks: mock });
    expect($.getByTestId('test')).toBeInTheDocument();
  });

  test.only('отправляются данные при update', async () => {
    const { $, waitRequest, cache } = await mountApp(<App />, { mocks: mock });
    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateData'));
    });

    jest.advanceTimersByTime(1010);
    // await waitRequest();
    const t = cache.readQuery({ query: GET_PROJECTS_QUERY });
    console.log(t);
    // expect(mutated).toBe(true);
  });

  test.todo('отменяется подписка destroy');
});
