import React, { useState } from 'react';
import { PageBanner } from '@gpn-prototypes/vega-ui';

import { ProjectForm } from '../../ui/features/projects';

import { cnPage } from './cn-page';
import { BannerInfoProps } from './types';

import './CreateProjectPage.css';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const [bannerInfo, setBannerInfo] = useState<BannerInfoProps>({});
  const { title, description } = bannerInfo;

  return (
    <div className={cnPage()}>
      <PageBanner title={title} description={description} />
      <ProjectForm bannerInfo={bannerInfo} setBannerInfo={setBannerInfo} />
    </div>
  );
};
