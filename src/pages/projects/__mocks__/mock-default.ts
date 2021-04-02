import { MeDocument, ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectOrderByEnum, ProjectStatusEnum, SortTypeEnum } from '../../../__generated__/types';
import { createProject } from '../../../testing/data-generators';

export const defaultMock = [
  {
    request: {
      query: MeDocument,
      variables: {},
    },
    result: {
      data: {
        me: {
          name: 'Константин Семенович К.',
          vid: 'a2222222-b111-c111-d111-e00000000008',
          code: null,
          isDeleted: false,
          createdAt: '2021-04-01T18:44: 00.197000',
          editedAt: '2021-04-02T11: 56:40.885000',
          login: 'adtest1@gpndt.test',
          firstName: 'Константин',
          patronym: 'Семенович',
          lastName: 'К.',
          adId: '5f1520e345531ceeba9ea7b0',
          role: 'ad test user',
          customSettings: {
            projectList: {
              orderBy: 'EDITED_AT',
              sortBy: 'DESC',
              __typename: 'ProjectListSortingSetting',
            },
            __typename: 'UserCustomSettings',
          },
          __typename: 'User',
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
        orderBy: undefined,
        sortBy: undefined,
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
      query: ProjectsTableListDocument,
      variables: {
        pageNumber: 1,
        pageSize: 20,
        includeBlank: false,
        orderBy: ProjectOrderByEnum.EditedAt,
        sortBy: SortTypeEnum.Desc,
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
      query: ProjectsTableListDocument,
      variables: {
        pageNumber: 1,
        pageSize: 20,
        includeBlank: false,
        orderBy: ProjectOrderByEnum.EditedAt,
        sortBy: SortTypeEnum.Desc,
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
