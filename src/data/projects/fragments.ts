import { gql } from '@apollo/client';

export const PROJECT_DATA_FRAGMENT = gql`
  fragment ProjectData on Project {
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
