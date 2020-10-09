import { gql } from '@apollo/client';

export const REGION_DATA_FRAGMENT = gql`
  fragment regionFragment on Region {
    name
    vid
  }
`;
