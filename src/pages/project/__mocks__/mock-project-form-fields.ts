import { ProjectFormFieldsDocument } from '../__generated__/project';

export const MockProjectFormFields = {
  request: {
    query: ProjectFormFieldsDocument,
    variables: { vid: '123' },
  },
  result: {
    data: {
      project: {
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
    },
  },
};
