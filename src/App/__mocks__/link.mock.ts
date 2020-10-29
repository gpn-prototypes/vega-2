import { gql } from '@apollo/client';

export const standardError = new Error('I never work');

export const GET_PROJECT_QUERY = gql`
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

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($project: ProjectParams!) {
    updateProject(project: $project) {
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

export const diffError = {
  data: {
    updateProject: {
      result: {
        code: 'PROJECT_VERSION_DIFF_ERROR',
        errorMessage: 'Расхождение версий проекта',
        details: 'Local project version 2 is greater than remote version 1',
        payload: {
          new_version: 2,
          old_version: 1,
        },
      },
    },
  },
};

export const queryData = {
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
};

export const mutationUpdateProjectVariable = {
  id: 1,
  name: 'new name',
  description: 'description 1',
  status: 'draft',
  version: 1,
};

export const mutationUpdateProjectMergedVariable = {
  id: 1,
  name: 'new name',
  description: 'description 1',
  status: 'draft',
  version: 2,
};

export const mutationUpdateProjectData = {
  data: {
    updateProject: {
      result: {
        id: 1,
        name: 'new name',
        description: 'description 2',
        status: 'draft',
        version: 2,
        __typename: 'Project',
      },
    },
  },
};

export const mutationUpdateProjectErrorData = {
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
};

export const mutationUpdateProjectErrorData3 = {
  data: {
    updateProject: {
      code: 'ERROR_DIFF',
      message: 'Local and remote versions do not match. Check for conflicts and make merge.',
      remoteProject: {
        id: 1,
        name: 'name',
        description: 'description 2',
        status: 'draft',
        version: 3,
      },
    },
  },
};

export const mutationValidationErrorData = {
  errors: [
    {
      locations: [
        {
          line: 1,
          column: 1,
        },
      ],
      message: 'Validation error',
    },
  ],
};

export const mutationCreateUserVariable = {
  id: 1,
  name: 'mang',
  firstName: 'User',
  lastName: 'LastUser',
};

export const mutationCreateUserData = {
  data: {
    createUser: {
      result: {
        name: 'mang',
        firstName: 'User',
        lastName: 'LastUser',
        __typename: 'User',
      },
    },
  },
};

export const mutationUpdateUserVariable = {
  id: 1,
  name: 'new name',
};

export const mutationUpdateUserData = {
  data: {
    updateUser: {
      result: {
        name: 'new user',
        firstName: 'User',
        lastName: 'LastUser',
        __typename: 'User',
      },
    },
  },
};
