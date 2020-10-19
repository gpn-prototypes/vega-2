import { gql } from '@apollo/client';

export const GET_PROJECTS_QUERY = gql`
  query GetProject {
    project {
      name
      description
      status
      version
    }
  }
`;
// ... on Error {
//   code
//   message
//   details
//   payload
// }
