import { gql } from '@apollo/client';

export const UPDATE_PROJECT_MUTATION = gql`
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
`;

export const GET_PROJECTS_QUERY = gql`
  query GetProject {
    project {
      id
      name
      description
      status
      version
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($id: ID, $name: String, $firstName: String, $lastName: String) {
    createUser(id: $id, name: $name, firstName: $firstName, lastName: $lastName) {
      id
      name
      firstName
      lastName
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID, $name: String, $firstName: String, $lastName: String) {
    updateUser(id: $id, name: $name, firstName: $firstName, lastName: $lastName) {
      id
      name
      firstName
      lastName
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser {
    project {
      id
      name
      firstName
      lastName
    }
  }
`;

export const variables = {
  mutationCreateUserVariable: {
    id: 1,
    name: 'mang',
    firstName: 'User',
    lastName: 'LastUser',
  },
  mutationUpdateUserVariable: {
    id: 1,
    name: 'new name',
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

export const mock = [
  {
    request: {
      query: GET_PROJECTS_QUERY,
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
      query: UPDATE_PROJECT_MUTATION,
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
    result: () => ({
      data: {
        updateProject: {
          project: projectAfterMutation,
        },
      },
    }),
  },
];

export const mockWithErrorDiff = [
  {
    request: {
      query: GET_PROJECTS_QUERY,
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
      query: UPDATE_PROJECT_MUTATION,
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
    result: () => ({
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
      query: UPDATE_PROJECT_MUTATION,
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
    result: () => ({
      data: {
        updateProject: {
          project: projectAfterMutationVer3,
        },
      },
    }),
  },
];

export const mockMultipleWithErrorDiff = [
  {
    request: {
      query: CREATE_USER_MUTATION,
      variables: variables.mutationCreateUserVariable,
    },
    result: {
      data: {
        user: {
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
      query: GET_PROJECTS_QUERY,
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
      query: UPDATE_PROJECT_MUTATION,
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
    result: () => ({
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
