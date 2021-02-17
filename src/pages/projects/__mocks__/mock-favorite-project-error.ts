import {
  ProjectsTableListDocument,
  ProjectToggleFavoriteDocument,
} from '../__generated__/projects';
import { ProjectStatusEnum } from '../../../__generated__/types';
import { createProject } from '../../../../test-utils/data-generators';

export const favoriteProjectErrorMock = [
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
  {
    request: {
      query: ProjectToggleFavoriteDocument,
      variables: {
        vid: 'a3333333-b111-c111-d111-e00000000000',
        isFavorite: true,
        version: 1,
      },
    },
    result: {
      data: {
        updateProject: {
          result: {
            code: 200,
            message: 'ошибка',
            __typename: 'Error',
          },
          __typename: 'UpdateProject',
        },
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
