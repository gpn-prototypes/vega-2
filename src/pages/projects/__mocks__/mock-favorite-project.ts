import {
  MeDocument,
  ProjectsTableListDocument,
  ProjectToggleFavoriteDocument,
} from '../__generated__/projects';
import { ProjectOrderByEnum, ProjectStatusEnum, SortTypeEnum } from '../../../__generated__/types';

export const favoriteProjectMock = [
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
        sortBy: undefined,
        orderBy: undefined,
      },
    },
    result: {
      data: {
        projects: {
          data: [
            {
              vid: 'a3333333-b111-c111-d111-e00000000000',
              isFavorite: false,
              name: 'FEM Example Project',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [
                {
                  user: {
                    name: 'Николай',
                    role: 'main test user',
                    __typename: 'User',
                  },
                  roles: [
                    {
                      name: 'Менеджер',
                      __typename: 'ProjectRole',
                    },
                  ],
                  __typename: 'Attendee',
                },
              ],
              region: null,
              editedAt: '2020-11-12T00:00:00',
              createdAt: '2020-11-12T00:00:00',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
            {
              vid: 'a3333333-b111-c111-d111-e00000000011',
              isFavorite: false,
              name: 'Test project 11',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [],
              region: null,
              editedAt: '2021-01-18T07:11:52.928000',
              createdAt: '2021-01-18T07:11:52.928000',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
            {
              vid: 'a3333333-b111-c111-d111-e00000000022',
              isFavorite: false,
              name: 'Test project 22',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [],
              region: null,
              editedAt: '2021-01-18T07:11:53.076000',
              createdAt: '2021-01-18T07:11:53.076000',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
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
            {
              vid: 'a3333333-b111-c111-d111-e00000000000',
              isFavorite: false,
              name: 'FEM Example Project',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [
                {
                  user: {
                    name: 'Николай',
                    role: 'main test user',
                    __typename: 'User',
                  },
                  roles: [
                    {
                      name: 'Менеджер',
                      __typename: 'ProjectRole',
                    },
                  ],
                  __typename: 'Attendee',
                },
              ],
              region: null,
              editedAt: '2020-11-12T00:00:00',
              createdAt: '2020-11-12T00:00:00',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
            {
              vid: 'a3333333-b111-c111-d111-e00000000011',
              isFavorite: false,
              name: 'Test project 11',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [],
              region: null,
              editedAt: '2021-01-18T07:11:52.928000',
              createdAt: '2021-01-18T07:11:52.928000',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
            {
              vid: 'a3333333-b111-c111-d111-e00000000022',
              isFavorite: false,
              name: 'Test project 22',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [],
              region: null,
              editedAt: '2021-01-18T07:11:53.076000',
              createdAt: '2021-01-18T07:11:53.076000',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
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
        projectId: 'a3333333-b111-c111-d111-e00000000000',
        isFavorite: true,
      },
    },
    result: {
      data: {
        setFavoriteProject: {
          vid: 'a3333333-b111-c111-d111-e00000000000',
          isFavorite: true,
          version: 2,
          __typename: 'Project',
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
        orderBy: ProjectOrderByEnum.EditedAt,
        sortBy: SortTypeEnum.Desc,
      },
    },
    result: {
      data: {
        projects: {
          data: [
            {
              vid: 'a3333333-b111-c111-d111-e00000000000',
              isFavorite: true,
              name: 'FEM Example Project',
              version: 2,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [
                {
                  user: {
                    name: 'Николай',
                    role: 'main test user',
                    __typename: 'User',
                  },
                  roles: [
                    {
                      name: 'Менеджер',
                      __typename: 'ProjectRole',
                    },
                  ],
                  __typename: 'Attendee',
                },
              ],
              region: null,
              editedAt: '2020-11-12T00:00:00',
              createdAt: '2020-11-12T00:00:00',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
            {
              vid: 'a3333333-b111-c111-d111-e00000000011',
              isFavorite: false,
              name: 'Test project 11',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [],
              region: null,
              editedAt: '2021-01-18T07:11:52.928000',
              createdAt: '2021-01-18T07:11:52.928000',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
            {
              vid: 'a3333333-b111-c111-d111-e00000000022',
              isFavorite: false,
              name: 'Test project 22',
              version: 1,
              description: null,
              status: ProjectStatusEnum.Unpublished,
              attendees: [],
              region: null,
              editedAt: '2021-01-18T07:11:53.076000',
              createdAt: '2021-01-18T07:11:53.076000',
              createdBy: {
                name: 'Николай',
                vid: 'a1111123-b111-c111-d111-e00000000000',
                __typename: 'User',
              },
              __typename: 'Project',
            },
          ],
          itemsTotal: 3,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
];
