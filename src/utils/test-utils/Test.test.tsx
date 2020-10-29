import React from 'react';
import { from, gql, useMutation, useQuery } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import * as tl from '@testing-library/react';

import { MergeLink } from '../../App/Link';

import { mountApp } from './mount-app';

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($project: ProjectParams!) {
    updateProject(project: $project) {
      project {
        id
        name
        description
        status
        version
      }
    }
  }
`;

export const GET_PROJECTS_QUERY = gql`
  query GetProject {
    project {
      id
      name
      description
      status
      version
    }
  }
`;

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
          __typename: 'Project',
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
    result: () => ({
      data: {
        updateProject: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 2,
          __typename: 'Project',
        },
      },
    }),
  },
];

const App = () => {
  useQuery(GET_PROJECTS_QUERY);
  const [mutate] = useMutation(UPDATE_PROJECT_MUTATION);

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
  return (
    <div>
      <button type="button" data-testid="updateData" onClick={handleClick}>
        Изменить данные
      </button>
    </div>
  );
};

describe('QueryWithMerge', () => {
  it('renders a list', async () => {
    const { $, waitRequest, cache } = await mountApp(<App />, { mocks: mock, link: MergeLink });
    await waitRequest();
    const t2 = cache.readQuery({ query: GET_PROJECTS_QUERY });
    console.log(t2);

    tl.act(() => {
      tl.fireEvent.click($.getByTestId('updateData'));
    });

    $.unmount();
    await waitRequest();

    console.log(cache.extract());

    // const t3 = cache.readQuery({ query: GET_PROJECTS_QUERY });
    // console.log(t3);
  });
});
