import { MeDocument, ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectOrderByEnum, ProjectStatusEnum, SortTypeEnum } from '../../../__generated__/types';
import { createProject } from '../../../testing';

const generateProjects = (number: number) => {
  const projects = [];

  for (let i = 1; i <= number; i += 1) {
    projects.push(createProject({ status: ProjectStatusEnum.Unpublished }));
  }

  return projects;
};

export const [firstPart, secondPart] = [generateProjects(20), generateProjects(20)];

export const paginationMocks = [
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
          data: firstPart,
          itemsTotal: 40,
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
          data: firstPart,
          itemsTotal: 40,
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
        pageNumber: 2,
        pageSize: 20,
        includeBlank: false,
        orderBy: ProjectOrderByEnum.EditedAt,
        sortBy: SortTypeEnum.Desc,
      },
    },
    result: {
      data: {
        projects: {
          data: secondPart,
          itemsTotal: 40,
          __typename: 'ProjectList',
        },
        __typename: 'Query',
      },
    },
  },
];
