import { ReferenceDataType } from '../../../../../pages/project/types';

export const referenceData: ReferenceDataType = {
  regionList: [
    {
      __typename: 'Region',
      name: 'Европа',
      fullName: 'Европушка',
      vid: '123',
      country: { __typename: 'Country', vid: 'c-123', name: 'Европейская' },
    },
    {
      __typename: 'Region',
      name: 'Россия',
      vid: '345',
      country: { __typename: 'Country', vid: 'c-123', name: 'Российская' },
    },
  ],
};
