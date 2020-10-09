import { gql } from '@apollo/client';

export const GET_PROJECTS_QUERY = gql`
  query getProjects {
    projectList {
      ... on ProjectList {
        projectList {
          vid
          name
          attendees {
            user {
              role
            }
            roles {
              name
            }
          }
          region {
            name
          }
          editedAt
          createdAt
          createdBy {
            name
            vid
          }
        }
      }
      ... on Error {
        code
        message
        details
      }
    }
  }
`;
