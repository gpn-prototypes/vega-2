import { CreateBlankProjectDocument } from '../__generated__/project';

export const MockCreateBlankProject = {
  request: {
    query: CreateBlankProjectDocument,
  },
  result: {
    data: {
      createProject: {
        result: {
          vid: '123',
          name: null,
          type: 'GEO',
          region: null,
          coordinates: null,
          description: null,
          yearStart: 2022,
          version: 1,
          status: 'BLANK',
          __typename: 'Project',
        },
        __typename: 'CreateProject',
      },
    },
  },
};
