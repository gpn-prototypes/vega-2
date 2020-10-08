import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Loader, PageBanner } from '@gpn-prototypes/vega-ui';

import { GET_PROJECTS_QUERY } from '../../data/projects';
import {
  CreateProjectMutationVariables,
  GetProjectsQuery,
  useCreateProjectMutation,
} from '../../generated/graphql';
import { ProjectForm } from '../../ui/features/projects';

import { cnPage } from './cn-page';
import { BannerInfoProps } from './types';

import './CreateProjectPage.css';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const [bannerInfo, setBannerInfo] = useState<BannerInfoProps>({});

  const [createProject, { data, loading }] = useCreateProjectMutation({
    update(cache, { data: newData }) {
      if (newData?.createProject?.result?.__typename === 'Project') {
        try {
          const prev = cache.readQuery({
            query: GET_PROJECTS_QUERY,
          }) as GetProjectsQuery;

          if (prev.projectList?.__typename === 'ProjectList' && prev.projectList.projectList) {
            cache.writeQuery({
              data: {
                ...prev,
                projectList: [...prev.projectList.projectList, newData.createProject?.result],
              },
              query: GET_PROJECTS_QUERY,
            });
          }
        } catch {
          return;
        }
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
        onSubmit={handleSubmitForm}
        bannerInfo={bannerInfo}
        setBannerInfo={setBannerInfo}
      />
    </div>
  );
};
