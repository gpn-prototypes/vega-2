import { gql } from '@apollo/client';

export const PROJECT_DATA_FRAGMENT = gql`
  fragment projectFragment on Project {
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
`;
