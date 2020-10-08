import { gql } from '@apollo/client';

export const REGION_DATA_FRAGMENT = gql`
  fragment Regions on Region {
    name
    vid
  }
`;
