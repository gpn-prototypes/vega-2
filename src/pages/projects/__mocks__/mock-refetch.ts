import { ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectStatusEnum } from '../../../__generated__/types';

const project = {
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
};

export const refetchMock = [
  {
    request: {
      query: ProjectsTableListDocument,
    },
    result: {
      data: {
        projects: {
          data: [project],
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
          data: [{ ...project, name: 'FEM Example Project 01' }],
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
          data: [{ ...project, name: 'FEM Example Project 02' }],
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
];
