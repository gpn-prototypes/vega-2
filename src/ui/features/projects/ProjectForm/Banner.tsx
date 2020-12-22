import React from 'react';
import { useFormState } from 'react-final-form';
import { PageBanner } from '@gpn-prototypes/vega-ui';

import { ReferenceDataType } from '../../../../pages/project/types';

type BannerProps = {
  referenceData: ReferenceDataType;
};
const testId = {
  banner: 'ProjectForm:banner',
  bannerEmpty: 'ProjectForm:banner.empty',
};
type BannerType = React.FC<BannerProps> & {
  testId: typeof testId;
};

const getDescription = (
  regionVid: string | undefined,
  regionList: ReferenceDataType['regionList'],
): string | undefined => {
  if (!regionVid) {
    return undefined;
  }

  const region = regionList?.find((r) => r?.vid === regionVid);

  const countryName = region?.country?.name;
  const regionName = region?.fullName || region?.name;

  return `${countryName}, ${regionName}`;
};

export const Banner: BannerType = (props) => {
  const { regionList } = props.referenceData;

  const { values } = useFormState();

  const title = values.name ? values.name : undefined;
  const description = values.region ? getDescription(values.region, regionList) : undefined;

  return <PageBanner title={title} description={description} testId={testId.banner} />;
};

Banner.testId = testId;
