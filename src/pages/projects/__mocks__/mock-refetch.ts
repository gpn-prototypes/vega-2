import { ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectStatusEnum } from '../../../__generated__/types';
import { createProject } from '../../../../test-utils/data-generators';

export const refetchMock = [
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
              status: ProjectStatusEnum.Unpublished,
            }),
          ],
          itemsTotal: 1,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
  {
    request: {
      query: ProjectsTableListDocument,
    },
    result: {
      data: {
        projects: {
          data: [
            {
              ...createProject({
                vid: 'a3333333-b111-c111-d111-e00000000000',
                status: ProjectStatusEnum.Unpublished,
              }),
              name: 'Example Project 01',
            },
          ],
          itemsTotal: 1,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
  {
    request: {
      query: ProjectsTableListDocument,
    },
    result: {
      data: {
        projects: {
          data: [
            {
              ...createProject({
                vid: 'a3333333-b111-c111-d111-e00000000000',
                status: ProjectStatusEnum.Unpublished,
              }),
              name: 'Example Project 02',
            },
          ],
          itemsTotal: 1,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
];
