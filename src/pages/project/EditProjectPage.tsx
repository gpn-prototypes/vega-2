import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@gpn-prototypes/vega-ui';

import { Project, ProjectStatusEnum } from '../../__generated__/types';
import { useNotifications } from '../../providers/notifications';
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
    name: project.name || undefined,
    type: project.type || undefined,
    region: project.region?.vid || undefined,
    coordinates: project.coordinates || undefined,
    description: project.description || undefined,
    yearStart: project.yearStart || undefined,
  };
};

export const EditProjectPage: React.FC<PageProps> = () => {
  const { projectId } = useParams<ParamsType>();
  const notifications = useNotifications();

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

  const handleFormSubmit = async (values: FormValues) => {
    const version =
      queryProjectData?.project?.__typename === 'Project' ? queryProjectData?.project?.version : 1;

    const updateProjectResult = await updateProject({
      variables: {
        vid: projectId,
        name: values.name,
        region: values.region && values.region !== 'NOT_SELECTED' ? values.region : null,
        coordinates: values.coordinates || null,
        description: values.description || null,
        yearStart: values.yearStart || null,
        status: ProjectStatusEnum.Unpublished,
        version: version || 1,
      },
    });

    if (updateProjectResult.data?.updateProject?.result?.__typename === 'Error') {
      const inlineUpdateProjectError = updateProjectResult.data?.updateProject?.result;

      notifications.add({
        key: `${inlineUpdateProjectError.code}-update-error`,
        status: 'alert',
        message: inlineUpdateProjectError.message,
        onClose(item) {
          notifications.remove(item.key);
        },
      });
    }

    if (updateProjectResult.data?.updateProject?.result?.__typename === 'Project') {
      notifications.add({
        key: `${projectId}-create`,
        status: 'success',
        autoClose: 3,
        message: 'Изменения успешно сохранены',
        onClose(item) {
          notifications.remove(item.key);
        },
      });
    }
  };

  const apolloError = queryProjectError || queryRegionListError || updateProjectError;

  if (apolloError) {
    notifications.add({
      key: `${apolloError.name}-apollo-error`,
      status: 'alert',
      message: apolloError.message,
    });

    return null;
  }

  if (queryProjectData?.project?.__typename === 'Error') {
    const inlineQueryProjectError = queryProjectData.project;

    notifications.add({
      key: `${inlineQueryProjectError.code}-query-error`,
      status: 'alert',
      message: inlineQueryProjectError.message,
    });

    return null;
  }

  if (queryProjectLoading || queryRegionListLoading) {
    return <Loader />;
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
