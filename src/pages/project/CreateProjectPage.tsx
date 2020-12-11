import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader } from '@gpn-prototypes/vega-ui';

import { ProjectStatusEnum } from '../../__generated__/types';
import { useNotifications } from '../../providers/notifications';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import {
  useCreateProject,
  useDeleteProject2,
  useQueryRegionList,
  useUpdateProject2,
} from './__generated__/project';
import { cnPage } from './cn-page';
import { RouteLeavingGuard } from './RouteLeavingGuard';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

const BLANK_PROJECT_ID = 'blank-project-id';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const history = useHistory();
  const notifications = useNotifications();

  const [isNavigationBlocked, setIsNavigationBlocked] = React.useState<boolean>(true);

  const [blankProjectId, setBlankProjectId] = useState<string | undefined>(undefined);

  const [createProject, { error: createProjectError }] = useCreateProject();

  const [updateProject, { error: updateProjectError }] = useUpdateProject2();

  const [deleteProject, { error: deleteProjectError }] = useDeleteProject2();

  useEffect(() => {
    let isCancelled = false;

    const data = localStorage.getItem(BLANK_PROJECT_ID);

    const call = async () => {
      const createProjectResult = await createProject();

      if (createProjectResult.data?.createProject?.result?.__typename === 'Project') {
        const projectId = createProjectResult.data.createProject?.result?.vid || undefined;

        localStorage.setItem(BLANK_PROJECT_ID, String(projectId));

        if (!isCancelled) {
          setBlankProjectId(projectId);
        }
      }

      if (createProjectResult.data?.createProject?.result?.__typename === 'Error') {
        const inlineCreateProjectError = createProjectResult.data?.createProject?.result;

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

    if (data) {
      setBlankProjectId(data);
    } else {
      call();
    }

    return () => {
      isCancelled = true;
    };
  }, [createProject, notifications]);

  const {
    data: queryRegionListData,
    loading: queryRegionListLoading,
    error: queryRegionListError,
  } = useQueryRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = async (values: FormValues) => {
    const updateProjectResult = await updateProject({
      variables: {
        vid: blankProjectId,
        name: values.name,
        region: values.region && values.region !== 'NOT_SELECTED' ? values.region : undefined,
        coordinates: values.coordinates,
        description: values.description,
        yearStart: values.yearStart,
        status: ProjectStatusEnum.Unpublished,
        version: 1,
      },
    });

    if (updateProjectResult.data?.updateProject?.result?.__typename === 'Project') {
      const projectId = updateProjectResult.data.updateProject?.result?.vid || undefined;

      localStorage.removeItem(BLANK_PROJECT_ID);

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
  };

  const handleCancel = () => {
    history.push('/projects');
  };

  const handleNavigation = async (path: string | null) => {
    const deleteProjectResult = await deleteProject({ variables: { vid: blankProjectId } });

    if (deleteProjectResult.data?.deleteProject?.result?.__typename === 'Result') {
      localStorage.removeItem(BLANK_PROJECT_ID);
    }

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
    createProjectError || updateProjectError || deleteProjectError || queryRegionListError;

  if (apolloError) {
    notifications.add({
      key: `${apolloError.name}-apollo-error`,
      status: 'alert',
      message: apolloError.message,
    });

    return null;
  }

  if (!blankProjectId || queryRegionListLoading) {
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
