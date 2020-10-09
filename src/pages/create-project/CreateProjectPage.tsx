import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Loader, PageBanner } from '@gpn-prototypes/vega-ui';

import {
  CreateProjectMutationVariables,
  useCreateProjectMutation,
  useGetProjectCreateDataQuery,
} from '../../generated/graphql';
import { ProjectForm } from '../../ui/features/projects';

import { cnPage } from './cn-page';
import { BannerInfoProps } from './types';

import './CreateProjectPage.css';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const [bannerInfo, setBannerInfo] = useState<BannerInfoProps>({});
  const projectCreateData = useGetProjectCreateDataQuery();

  const [createProject, { data, loading }] = useCreateProjectMutation({
    update(cache, { data: newData }) {
      if (newData?.createProject?.result?.__typename === 'Project') {
        cache.modify({
          fields: {
            projectList(existingProjects = { projectList: [] }) {
              return {
                ...existingProjects,
                projectList: [...existingProjects.projectList, newData.createProject?.result],
              };
            },
          },
        });
      }
    },
  });

  if (loading) {
    return <Loader />;
  }

  if (data?.createProject?.result?.__typename === 'Project') {
    return <Redirect to="/projects" />;
  }

  const handleSubmitForm = (values: CreateProjectMutationVariables): void => {
    createProject({ variables: values });
  };

  const { title, description } = bannerInfo;

  return (
    <div className={cnPage()}>
      <PageBanner title={title} description={description} />
      <ProjectForm
        projectCreateData={projectCreateData}
        onSubmit={handleSubmitForm}
        bannerInfo={bannerInfo}
        setBannerInfo={setBannerInfo}
      />
    </div>
  );
};
