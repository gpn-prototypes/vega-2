import { gql } from '@apollo/client';

export const COORDINATE_SYSTEMS_DATA_FRAGMENT = gql`
  fragment coordinateSystemFragment on CoordinateSystem {
    name
    vid
  }
`;
