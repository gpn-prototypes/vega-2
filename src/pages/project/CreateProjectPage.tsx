import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, useMount } from '@gpn-prototypes/vega-ui';

import { ProjectStatusEnum } from '../../__generated__/types';
import { useNotifications } from '../../providers/notifications';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import {
  useCreateBlankProject,
  useCreateProject,
  useDeleteBlankProject,
  useProjectFormRegionList,
} from './__generated__/project';
import { cnPage } from './cn-page';
import { RouteLeavingGuard } from './RouteLeavingGuard';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const history = useHistory();
  const notifications = useNotifications();

  const [isNavigationBlocked, setIsNavigationBlocked] = React.useState<boolean>(true);

  const [blankProjectId, setBlankProjectId] = useState<string | undefined>(undefined);

  const [
    createBlankProject,
    { error: createBlankProjectError, loading: createBlankProjectLoading },
  ] = useCreateBlankProject();

  const [createProject, { error: createProjectError }] = useCreateProject();

  const [deleteProject, { error: deleteProjectError }] = useDeleteBlankProject();

  const call = async () => {
    const createBlankProjectResult = await createBlankProject();

    if (createBlankProjectResult.data?.createProject?.result?.__typename === 'Project') {
      const projectId = createBlankProjectResult.data.createProject?.result?.vid || undefined;

      setBlankProjectId(projectId);
    }

    if (createBlankProjectResult.data?.createProject?.result?.__typename === 'Error') {
      const inlineCreateProjectError = createBlankProjectResult.data?.createProject?.result;

      notifications.add({
        key: `${inlineCreateProjectError.code}-create-error`,
        status: 'alert',
        message: inlineCreateProjectError.message,
        onClose(item) {
          notifications.remove(item.key);
        },
      });
    }
  };

  useMount(() => {
    call();
  });

  const {
    data: queryRegionListData,
    loading: queryRegionListLoading,
    error: queryRegionListError,
  } = useProjectFormRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = React.useCallback(
    async (values: FormValues) => {
      const errors: Record<string, unknown> = {};

      const createProjectResult = await createProject({
        variables: {
          vid: blankProjectId,
          name: values.name,
          region: values.region,
          coordinates: values.coordinates,
          description: values.description,
          yearStart: values.yearStart,
          status: ProjectStatusEnum.Unpublished,
          version: 1,
        },
      });

      if (createProjectResult.data?.updateProject?.result?.__typename === 'Project') {
        const projectId = createProjectResult.data.updateProject?.result?.vid || undefined;

        setIsNavigationBlocked(false);

        notifications.add({
          key: `${projectId}-create`,
          status: 'success',
          autoClose: 3,
          message: 'Проект успешно создан',
          onClose(item) {
            notifications.remove(item.key);
          },
        });

        history.push(`/projects/show/${projectId}`);
      }

      if (createProjectResult.data?.updateProject?.result?.__typename === 'Error') {
        const inlineUpdateProjectError = createProjectResult.data?.updateProject?.result;

        const projectNameExists = inlineUpdateProjectError?.code === 'PROJECT_NAME_ALREADY_EXISTS';

        if (projectNameExists) {
          errors.name = inlineUpdateProjectError.message;
        }

        if (!projectNameExists) {
          notifications.add({
            key: `${inlineUpdateProjectError.code}-create`,
            status: 'alert',
            message: inlineUpdateProjectError.message,
            onClose(item) {
              notifications.remove(item.key);
            },
          });
        }
      }

      return errors;
    },
    [blankProjectId, createProject, history, notifications],
  );

  const handleCancel = () => {
    history.push('/projects');
  };

  const handleNavigation = async (path: string | null) => {
    const deleteProjectResult = await deleteProject({ variables: { vid: blankProjectId } });

    if (deleteProjectResult.data?.deleteProject?.result?.__typename === 'Error') {
      const inlineDeleteProjectError = deleteProjectResult.data?.deleteProject?.result;

      notifications.add({
        key: `${inlineDeleteProjectError.code}-delete-error`,
        status: 'alert',
        message: inlineDeleteProjectError.message,
      });
    }

    setIsNavigationBlocked(false);
    history.push(path || '/projects');
  };

  const apolloError =
    createBlankProjectError || createProjectError || deleteProjectError || queryRegionListError;

  if (apolloError) {
    notifications.add({
      key: `${apolloError.name}-apollo-error`,
      status: 'alert',
      message: apolloError.message,
      onClose: (item) => {
        notifications.remove(item.key);
      },
    });

    return null;
  }

  if (createBlankProjectLoading || queryRegionListLoading) {
    return <Loader />;
  }

  return (
    <div className={cnPage()}>
      <ProjectForm
        mode="create"
        referenceData={referenceData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
      <RouteLeavingGuard when={isNavigationBlocked} navigate={handleNavigation} />
    </div>
  );
};
