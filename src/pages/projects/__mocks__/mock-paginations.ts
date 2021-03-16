import { ProjectsTableListDocument } from '../__generated__/projects';
import { ProjectStatusEnum } from '../../../__generated__/types';
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
