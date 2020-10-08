import { gql } from '@apollo/client';

import { COORDINATE_SYSTEMS_DATA_FRAGMENT } from '../coordinateSystems';
import { REGION_DATA_FRAGMENT } from '../regions';

import { PROJECT_DATA_FRAGMENT } from './fragments';

export const GET_PROJECTS_QUERY = gql`
  ${PROJECT_DATA_FRAGMENT}
  query GetProjects {
    projectList {
      ... on ProjectList {
        projectList {
          ...ProjectData
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

export const GET_PROJECT_CREATE_DATA_QUERY = gql`
  ${REGION_DATA_FRAGMENT}
  ${COORDINATE_SYSTEMS_DATA_FRAGMENT}
  query GetProjectCreateData {
    regionList {
      ...Regions
    }
    coordinateSystemList {
      ...CoordinateSystems
    }
  }
`;
