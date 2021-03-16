import { DeleteProjectDocument, ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectStatusEnum } from '../../../__generated__/types';
import { createProject } from '../../../testing';

export const deleteProjectMock = [
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
      query: DeleteProjectDocument,
      variables: {
        vid: 'a3333333-b111-c111-d111-e00000000000',
      },
    },
    result: {
      data: {
        deleteProject: {
          result: { vid: 'a3333333-b111-c111-d111-e00000000000', __typename: 'Result' },
          __typename: 'DeleteProject',
        },
      },
    },
  },
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
          itemsTotal: 2,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
];
