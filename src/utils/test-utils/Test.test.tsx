import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import * as tl from '@testing-library/react';

import { MergeLink } from '../../App/Link';

import {
  CREATE_USER_MUTATION,
  GET_PROJECTS_QUERY,
  mock,
  mockMultipleWithErrorDiff,
  mockWithErrorDiff,
  projectAfterMutation,
  projectAfterMutationVer3,
  UPDATE_PROJECT_MUTATION,
  variables,
} from './mocks';
import { mountApp } from './mount-app';

type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  version: number;
};

type QueryResult = { project: Project };

const App = () => {
  useQuery(GET_PROJECTS_QUERY);
  const [mutate] = useMutation(UPDATE_PROJECT_MUTATION);
  const [userCreate] = useMutation(CREATE_USER_MUTATION);

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

  const handleUpdateAndCreate = () => {
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

    userCreate({
      variables: variables.mutationCreateUserVariable,
    });
  };

  return (
    <div>
      <button type="button" data-testid="updateData" onClick={handleClick}>
        Изменить данные
      </button>
      <button type="button" data-testid="updateAndCreateData" onClick={handleUpdateAndCreate}>
        Изменить данные
      </button>
    </div>
  );
};

describe('QueryWithMerge', () => {
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

    const query = await cache.readQuery({ query: GET_PROJECTS_QUERY });

    expect(query.project).toEqual(projectAfterMutation);
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

    const query = await cache.readQuery({ query: GET_PROJECTS_QUERY });

    expect(query.project).toEqual(projectAfterMutationVer3);
  });

  it.only('запускаются несколько мутаций с конфликтом в одной из них', async () => {
    const { $, waitRequest, cache } = await mountApp(<App />, {
      mocks: mockMultipleWithErrorDiff,
      link: new MergeLink(),
    });
    await waitRequest();

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateAndCreateData'));
    });

    await waitRequest();

    const queryProject = await cache.readQuery({ query: GET_PROJECTS_QUERY });

    expect(queryProject.project).toEqual(projectAfterMutationVer3);
  });
});
