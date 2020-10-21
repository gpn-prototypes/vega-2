import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, PageBanner } from '@gpn-prototypes/vega-ui';

import { ProjectForm } from '../../ui/features/projects';

import {
  CreateProjectVariables,
  useCreateProject,
  useQueryRegionList,
} from './__generated__/create-project';
import { cnPage } from './cn-page';
import { BannerInfoProps, ReferenceDataType } from './types';

import './CreateProjectPage.css';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const [bannerInfo, setBannerInfo] = useState<BannerInfoProps>({});
  const { title, description } = bannerInfo;

  const history = useHistory();

  const { data: queryRegionListData, loading: isQueryRegionListLoading } = useQueryRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const [
    createProject,
    { data: createProjectData, called: isCreateProjectCalled },
  ] = useCreateProject();

  const handleFormSubmit = (values: CreateProjectVariables) => {
    createProject({ variables: values });
    history.push('/projects');
  };

  if (isCreateProjectCalled && createProjectData) {
    // eslint-disable-next-line no-console
    console.log({ createProjectData });
  }

  if (isQueryRegionListLoading) {
    return <Loader />;
  }

  return (
    <div className={cnPage()}>
      <PageBanner title={title} description={description} />
      <ProjectForm
        bannerInfo={bannerInfo}
        setBannerInfo={setBannerInfo}
        referenceData={referenceData}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
