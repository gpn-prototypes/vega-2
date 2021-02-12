import { ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectStatusEnum } from '../../../__generated__/types';

export const defaultMock = [
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
];
