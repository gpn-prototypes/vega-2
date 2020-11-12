import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@gpn-prototypes/vega-ui';

import { Project, ProjectStatusEnum } from '../../__generated__/types';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import { useQueryProject, useQueryRegionList, useUpdateProject2 } from './__generated__/project';
import { cnPage } from './cn-page';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type ParamsType = {
  projectId: string;
};

type PageProps = Record<string, unknown>;

type ProjectType = Pick<
  Project,
  'vid' | 'name' | 'type' | 'region' | 'coordinates' | 'description' | 'yearStart'
>;

const getInitialValues = (project: ProjectType): FormValues => {
  return {
    description: {
      name: project.name || undefined,
      type: project.type || undefined,
      region: project.region?.vid || undefined,
      coordinates: project.coordinates || undefined,
      description: project.description || undefined,
      yearStart: project.yearStart || undefined,
    },
  };
};

export const EditProjectPage: React.FC<PageProps> = () => {
  const { projectId } = useParams<ParamsType>();

  const {
    data: queryProjectData,
    loading: queryProjectLoading,
    error: queryProjectError,
  } = useQueryProject({
    variables: {
      vid: projectId,
    },
  });

  const [updateProject, { error: updateProjectError }] = useUpdateProject2();

  const {
    data: queryRegionListData,
    loading: queryRegionListLoading,
    error: queryRegionListError,
  } = useQueryRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = (values: FormValues) => {
    // eslint-disable-next-line no-console
    console.log('handleFormSubmit', values);

    const version =
      queryProjectData?.project?.__typename === 'Project' ? queryProjectData?.project?.version : 0;

    updateProject({
      variables: {
        ...values.description,
        vid: projectId,
        status: ProjectStatusEnum.Unpublished,
        version: version || 0,
      },
    });
  };

  if (queryProjectLoading || queryRegionListLoading) {
    return <Loader />;
  }

  if (queryProjectError || queryRegionListError || updateProjectError) {
    // eslint-disable-next-line no-console
    console.log(queryProjectError, queryRegionListError, updateProjectError);
    return null;
  }

  if (queryProjectData?.project?.__typename === 'Error') {
    // eslint-disable-next-line no-console
    console.log(queryProjectData.project);
    return null;
  }

  const initialValues =
    queryProjectData?.project?.__typename !== 'Project' || !queryProjectData?.project
      ? undefined
      : getInitialValues(queryProjectData?.project);

  return (
    <div className={cnPage()}>
      <ProjectForm
        mode="edit"
        referenceData={referenceData}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
