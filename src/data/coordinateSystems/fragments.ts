import { gql } from '@apollo/client';

export const COORDINATE_SYSTEMS_DATA_FRAGMENT = gql`
  fragment CoordinateSystems on CoordinateSystem {
    name
    vid
  }
`;
