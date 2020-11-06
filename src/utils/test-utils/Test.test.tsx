import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import * as tl from '@testing-library/react';

import { MergeLink } from '../../App/Link';

import {
  mock,
  mockedError,
  mockMultipleWithErrorDiff,
  mockWithErrorDiff,
  Project,
  projectAfterMutation,
  projectAfterMutationVer3,
  query,
  User,
  userAfterUpdate,
  variables,
} from './mocks';
import { mountApp } from './mount-app';

type QueryProjectResult = { project: Project };
type QueryUserResult = { user: User };

const App = () => {
  useQuery(query.GET_PROJECTS_QUERY);

  const [mutate, { error, loading }] = useMutation(query.UPDATE_PROJECT_MUTATION, {
    errorPolicy: 'all',
  });

  const handleClick = () => {
    mutate({
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    });
  };

  if (loading) {
    return <div data-testid="loading">Идёт загрузка</div>;
  }

  if (error) {
    return <div data-testid="error">Ошибка</div>;
  }

  return (
    <div>
      <button type="button" data-testid="updateData" onClick={handleClick}>
        Изменить данные
      </button>
    </div>
  );
};

const AppWithMultipleQuery = () => {
  useQuery(query.GET_PROJECTS_QUERY);
  useQuery(query.GET_USER_QUERY);

  const [mutate] = useMutation(query.UPDATE_PROJECT_MUTATION);
  const [userUpdate] = useMutation(query.UPDATE_USER_MUTATION);

  const handleUpdateAndCreate = () => {
    userUpdate({
      variables: { user: variables.mutationUpdateUserVariable },
    });

    mutate({
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    });
  };

  return (
    <div>
      <button type="button" data-testid="updateAndCreateData" onClick={handleUpdateAndCreate}>
        Изменить данные
      </button>
    </div>
  );
};

describe('QueryWithMerge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерится без ошибок', async () => {
    const { $ } = await mountApp(<div data-testid="test" />, { mocks: mock });
    expect($.getByTestId('test')).toBeInTheDocument();
  });

  it('происходит мутация', async () => {
    const { $, waitRequest, cache } = await mountApp(<App />, {
      mocks: mock,
      link: new MergeLink(),
    });
    await waitRequest();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateData'));
    });

    await waitRequest();

    const project = await cache.readQuery<QueryProjectResult>({ query: query.GET_PROJECTS_QUERY })
      ?.project;

    expect(project).toEqual(projectAfterMutation);
  });

  it('происходит мутация c решением конфликта', async () => {
    const { $, waitRequest, cache } = await mountApp(<App />, {
      mocks: mockWithErrorDiff,
      link: new MergeLink(),
    });
    await waitRequest();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateData'));
    });

    await waitRequest();

    const project = await cache.readQuery<QueryProjectResult>({ query: query.GET_PROJECTS_QUERY })
      ?.project;

    expect(project).toEqual(projectAfterMutationVer3);
  });

  it('запускаются несколько мутаций с конфликтом в одной из них', async () => {
    const { $, waitRequest, cache } = await mountApp(<AppWithMultipleQuery />, {
      mocks: mockMultipleWithErrorDiff,
      link: new MergeLink(),
    });
    await waitRequest();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateAndCreateData'));
    });

    await waitRequest();

    const project = await cache.readQuery<QueryProjectResult>({ query: query.GET_PROJECTS_QUERY })
      ?.project;
    const user = await cache.readQuery<QueryUserResult>({ query: query.GET_USER_QUERY })?.user;

    expect(project).toEqual(projectAfterMutationVer3);
    expect(user).toEqual(userAfterUpdate);
  });

  it('возвращается ошибка', async () => {
    const { $, waitRequest } = await mountApp(<App />, {
      mocks: mockedError,
      link: new MergeLink(),
    });

    await waitRequest();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateData'));
    });

    await waitRequest();

    expect($.getByTestId('error')).toBeInTheDocument();
  });

  it('отображается статус загрузки при мутации c решением конфликта', async () => {
    const { $, waitRequest } = await mountApp(<App />, {
      mocks: mockWithErrorDiff,
      link: new MergeLink(),
    });
    await waitRequest();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateData'));
    });

    const loading = $.getByTestId('loading');

    expect(loading).toBeInTheDocument();

    await waitRequest();
  });
});
