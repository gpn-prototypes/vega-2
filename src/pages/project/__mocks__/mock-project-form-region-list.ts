import { ProjectFormRegionListDocument } from '../__generated__/project';

export const MockProjectFormRegionList = {
  request: {
    query: ProjectFormRegionListDocument,
  },
  result: {
    data: {
      regionList: [
        {
          vid: '123',
          name: 'Адыгея',
          fullName: 'Республика Адыгея',
          country: {
            vid: '123',
            name: 'Российская Федерация',
            __typename: 'Country',
          },
          __typename: 'Region',
        },
      ],
    },
  },
};
