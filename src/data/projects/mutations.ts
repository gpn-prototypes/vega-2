import { gql } from '@apollo/client';

import { PROJECT_DATA_FRAGMENT } from './fragments';

export const CREATE_PROJECT_MUTATION = gql`
  ${PROJECT_DATA_FRAGMENT}
  mutation CreateProject(
    $name: String!
    $type: String
    $description: String
    $region: ID
    $coordinateSystem: ID
  ) {
    createProject(
      data: {
        name: $name
        region: $region
        type: $type
        description: $description
        coordinateSystem: $coordinateSystem
      }
    ) {
      result {
        ... on Project {
          ...ProjectData
        }

        ... on Error {
          code
          details
          payload
        }
      }
    }
  }
`;
