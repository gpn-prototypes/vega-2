import { FetchResult, gql } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

export type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  version: number;
};

export type User = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
};

type DiffError = {
  code: string;
  message: string;
  remoteProject: Project;
};

type ProjectData = {
  updateProject: {
    project: Project;
  };
};

type ProjectDiffError = {
  updateProject: DiffError;
};

type UserData = {
  updateUser: {
    user: User;
  };
};

export const query = {
  UPDATE_PROJECT_MUTATION: gql`
    mutation UpdateProject(
      $id: ID!
      $name: String
      $description: String
      $status: String
      $version: Number
    ) {
      updateProject(
        id: $id
        name: $name
        description: $description
        status: $status
        version: $version
      ) {
        project {
          id
          name
          description
          status
          version
        }
      }
    }
  `,
  GET_PROJECTS_QUERY: gql`
    query GetProject {
      project {
        id
        name
        description
        status
        version
      }
    }
  `,
  CREATE_USER_MUTATION: gql`
    mutation CreateUser($id: ID, $name: String, $firstName: String, $lastName: String) {
      createUser(id: $id, name: $name, firstName: $firstName, lastName: $lastName) {
        id
        name
        firstName
        lastName
      }
    }
  `,
  UPDATE_USER_MUTATION: gql`
    mutation UpdateUser($id: ID, $name: String, $firstName: String, $lastName: String) {
      updateUser(id: $id, name: $name, firstName: $firstName, lastName: $lastName) {
        user {
          id
          name
          firstName
          lastName
        }
      }
    }
  `,
  GET_USER_QUERY: gql`
    query GetUser {
      user {
        id
        name
        firstName
        lastName
      }
    }
  `,
};

export const variables = {
  mutationUpdateUserVariable: {
    id: 0,
    name: 'mang',
    firstName: 'User',
    lastName: 'LastUser',
  },
};

export const projectAfterMutation = {
  id: 1,
  name: 'new name',
  description: 'description 1',
  status: 'draft',
  version: 2,
  __typename: 'Project',
};

export const projectAfterMutationVer3 = {
  id: 1,
  name: 'new name',
  description: 'description 1',
  status: 'draft',
  version: 3,
  __typename: 'Project',
};

export const userAfterUpdate = {
  id: 0,
  name: 'mang',
  firstName: 'User',
  lastName: 'LastUser',
  __typename: 'User',
};

export const mock: MockedResponse[] = [
  {
    request: {
      query: query.GET_PROJECTS_QUERY,
    },
    result: {
      data: {
        project: {
          id: 1,
          name: 'name 1',
          description: 'description 1',
          status: 'draft',
          version: 1,
          __typename: 'Project',
        },
      },
    },
  },
  {
    request: {
      query: query.UPDATE_PROJECT_MUTATION,
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    },
    result: (): FetchResult<ProjectData> => ({
      data: {
        updateProject: {
          project: projectAfterMutation,
        },
      },
    }),
  },
];

export const mockWithErrorDiff: MockedResponse[] = [
  {
    request: {
      query: query.GET_PROJECTS_QUERY,
    },
    result: {
      data: {
        project: {
          id: 1,
          name: 'name 1',
          description: 'description 1',
          status: 'draft',
          version: 1,
          __typename: 'Project',
        },
      },
    },
  },
  {
    request: {
      query: query.UPDATE_PROJECT_MUTATION,
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    },
    result: (): FetchResult<ProjectDiffError> => ({
      data: {
        updateProject: {
          code: 'ERROR_DIFF',
          message: 'Local and remote versions do not match. Check for conflicts and make merge.',
          remoteProject: {
            id: 1,
            name: 'name',
            description: 'description 1',
            status: 'draft',
            version: 2,
          },
        },
      },
    }),
    newData: jest.fn(() => ({ data: { updateProject: { project: projectAfterMutationVer3 } } })),
  },
  {
    request: {
      query: query.UPDATE_PROJECT_MUTATION,
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 2,
        },
      },
    },
    result: (): FetchResult<ProjectData> => ({
      data: {
        updateProject: {
          project: projectAfterMutationVer3,
        },
      },
    }),
  },
];

export const mockMultipleWithErrorDiff: MockedResponse[] = [
  {
    request: {
      query: query.GET_PROJECTS_QUERY,
    },
    result: {
      data: {
        project: {
          id: 1,
          name: 'name 1',
          description: 'description 1',
          status: 'draft',
          version: 1,
          __typename: 'Project',
        },
      },
    },
  },
  {
    request: {
      query: query.GET_USER_QUERY,
    },
    result: {
      data: {
        user: {
          id: 0,
          name: 'first user',
          firstName: 'first',
          lastName: 'user',
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: query.UPDATE_USER_MUTATION,
      variables: { user: variables.mutationUpdateUserVariable },
    },
    result: (): FetchResult<UserData> => ({
      data: {
        updateUser: {
          user: userAfterUpdate,
        },
      },
    }),
  },
  {
    request: {
      query: query.UPDATE_PROJECT_MUTATION,
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    },
    result: (): FetchResult<ProjectDiffError> => ({
      data: {
        updateProject: {
          code: 'ERROR_DIFF',
          message: 'Local and remote versions do not match. Check for conflicts and make merge.',
          remoteProject: {
            id: 1,
            name: 'name',
            description: 'description 1',
            status: 'draft',
            version: 2,
          },
        },
      },
    }),
    newData: jest.fn(() => ({ data: { updateProject: { project: projectAfterMutationVer3 } } })),
  },
];

export const mockedError: MockedResponse[] = [
  {
    request: {
      query: query.GET_PROJECTS_QUERY,
    },
    result: {
      data: {
        project: {
          id: 1,
          name: 'name 1',
          description: 'description 1',
          status: 'draft',
          version: 1,
          __typename: 'Project',
        },
      },
    },
  },
  {
    request: {
      query: query.UPDATE_PROJECT_MUTATION,
      variables: {
        project: {
          id: 1,
          name: 'new name',
          description: 'description 1',
          status: 'draft',
          version: 1,
        },
      },
    },
    // error: new Error('aw shucks'),
    result: {
      errors: [new GraphQLError('fake error!')],
    },
  },
];
