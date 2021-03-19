import React from 'react';

import { ProjectStatusEnum } from '../__generated__/types';
import { ProjectsTableListDocument } from '../pages/projects/__generated__/projects';
import { createProject, render, screen, waitRequests } from '../testing';

import { AppView } from './AppView';

const defaultMock = [
  {
    request: {
      query: ProjectsTableListDocument,
      variables: {
        pageNumber: 1,
        pageSize: 20,
        includeBlank: false,
      },
    },
    result: {
      data: {
        projects: {
          data: [
            createProject({
              vid: 'a3333333-b111-c111-d111-e00000000000',
              name: 'Test project 01',
              status: ProjectStatusEnum.Unpublished,
            }),
            createProject({
              vid: 'a3333333-b111-c111-d111-e00000000011',
              name: 'Test project 11',
              status: ProjectStatusEnum.Unpublished,
            }),
            createProject({
              vid: 'a3333333-b111-c111-d111-e00000000022',
              name: 'Test project 22',
              status: ProjectStatusEnum.Unpublished,
            }),
          ],
          itemsTotal: 3,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
];

describe('AppView', () => {
  test('рендерится без ошибок', () => {
    expect(() => render(<AppView />)).not.toThrow();
  });

  test('рендерится приложение', async () => {
    render(<AppView />, { route: '/projects', mocks: defaultMock });

    await waitRequests();

    expect(await screen.getByLabelText('Расчётная платформа')).toBeInTheDocument();
  });
});
