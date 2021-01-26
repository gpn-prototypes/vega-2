import React from 'react';
import { PageBanner } from '@gpn-prototypes/vega-ui';

import { ReferenceDataType } from '../../../../pages/project/types';

import { ProjectFormRegionList } from '@/pages/project/__generated__/project';

export type BannerProps = {
  regions: ProjectFormRegionList['regionList'];
  regionId?: string | null;
  title?: string;
};

const testId = {
  banner: 'ProjectForm:banner',
  bannerEmpty: 'ProjectForm:banner.empty',
};

export type BannerType = React.FC<BannerProps> & {
  testId: typeof testId;
};

export const getDescription = (
  regionVid: string,
  regionList: ReferenceDataType['regionList'],
): string | undefined => {
  const region = regionList?.find((r) => r?.vid === regionVid);

  if (!region) {
    return undefined;
  }

  const countryName = region?.country?.name;
  const regionName = region?.fullName || region?.name;

  if (!countryName || !regionName) {
    return undefined;
  }

  return `${countryName}, ${regionName}`;
};

export const Banner: BannerType = (props) => {
  const { regions, regionId, title } = props;

  const description = regionId ? getDescription(regionId, regions) : undefined;

  return <PageBanner title={title} description={description} testId={testId.banner} />;
};

Banner.testId = testId;
