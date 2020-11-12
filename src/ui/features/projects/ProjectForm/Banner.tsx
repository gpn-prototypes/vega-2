import React from 'react';
import { useFormState } from 'react-final-form';
import { PageBanner } from '@gpn-prototypes/vega-ui';

import { ReferenceDataType } from '../../../../pages/project/types';

type BannerProps = {
  referenceData: ReferenceDataType;
};

const getDescription = (
  region: string | undefined,
  regionList: ReferenceDataType['regionList'],
): string | undefined => {
  if (!region) {
    return undefined;
  }

  const reg = regionList?.find((r) => r?.vid === region);

  const countryName = reg?.country?.name;
  const regionName = reg?.fullName || reg?.name;

  return `${countryName}, ${regionName}`;
};

export const Banner: React.FC<BannerProps> = (props) => {
  const { regionList } = props.referenceData;

  const { values } = useFormState();

  const title = values.description ? values.description.name : undefined;
  const description = values.description
    ? getDescription(values.description.region, regionList)
    : undefined;

  return <PageBanner title={title} description={description} />;
};
