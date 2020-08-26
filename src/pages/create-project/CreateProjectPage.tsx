import React, { useState } from 'react';
import { PageBanner } from '@gpn-prototypes/vega-ui';
import { ProjectForm } from '@vega/ui/features/projects';

import { cnPage } from './cn-page';

import './CreateProjectPage.css';

type PageProps = {};

type BannerInfoProps = {
  title?: string;
  description?: string;
};

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
