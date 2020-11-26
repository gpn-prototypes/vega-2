import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, useMount } from '@gpn-prototypes/vega-ui';
import { FormApi, getIn, setIn } from 'final-form';

import {
  ProjectStatusEnum,
  ProjectTypeEnum,
  ProjectUpdateType,
  UpdateProject,
  UpdateProjectDiff,
} from '../../__generated__/types';
import { useBrowserTabActivity } from '../../hooks';
import { useNotifications } from '../../providers/notifications';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import {
  projectFormFields,
  UpdateProjectFormVariables,
  useCreateBlankProject,
  useDeleteBlankProject,
  useProjectFormFields,
  useProjectFormRegionList,
  useUpdateProjectForm,
} from './__generated__/project';
import { cnPage } from './cn-page';
import { RouteLeavingGuard } from './RouteLeavingGuard';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type PageProps = Record<string, unknown>;

type ProjectType = projectFormFields;
interface UpdateProjectDiffResult extends UpdateProject {
  result: Required<UpdateProjectDiff>;
}

const getInitialValues = (project: ProjectType): Partial<FormValues> => {
  return {
    name: project.name ?? '',
    type: project.type ?? ProjectTypeEnum.Geo,
    region: project.region?.vid ?? null,
    coordinates: project.coordinates ?? '',
    description: project.description ?? '',
    yearStart: project.yearStart ?? undefined,
    status: project.status ?? ProjectStatusEnum.Blank,
  };
};

const FORM_FIELDS_POLLING_MS = 1000 * 30;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const history = useHistory();
  const notifications = useNotifications();

  const [blankProjectId, setBlankProjectId] = useState<string | undefined>(undefined);
  const [isNavigationBlocked, setIsNavigationBlocked] = React.useState<boolean>(true);

  const [
    createBlankProject,
    { error: createBlankProjectError, loading: createBlankProjectLoading },
  ] = useCreateBlankProject();

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
    data: queryProjectData,
    loading: queryProjectLoading,
    refetch: refetchProjectFormFields,
    error: queryProjectError,
    startPolling,
    stopPolling,
  } = useProjectFormFields({
    pollInterval: FORM_FIELDS_POLLING_MS,
    variables: {
      vid: blankProjectId,
    },
    skip: !blankProjectId,
  });

  useBrowserTabActivity({
    onActivated() {
      refetchProjectFormFields();
      startPolling(FORM_FIELDS_POLLING_MS);
    },
    onHidden() {
      stopPolling();
    },
  });

  const [updateProjectBlank, { error: updateProjectBlankError }] = useUpdateProjectForm();

  const {
    data: queryRegionListData,
    loading: queryRegionListLoading,
    error: queryRegionListError,
  } = useProjectFormRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = React.useCallback(
    async (values: FormValues, form: FormApi<FormValues>) => {
      const state = form.getState();
      const errors: Record<string, unknown> = {};

      const changes = Object.keys(state.dirtyFields)
        .map((key) => ({ key, value: getIn(values, key) }))
        .reduce((acc, { key, value }) => setIn(acc, key, value), {});

      const version =
        queryProjectData?.project?.__typename === 'Project'
          ? queryProjectData?.project?.version
          : 1;

      const status =
        values.status === ProjectStatusEnum.Unpublished
          ? { status: ProjectStatusEnum.Unpublished }
          : {};

      const updateProjectBlankResult = await updateProjectBlank({
        context: {
          projectDiffResolving: {
            maxAttempts: 5,
            projectAccessor: {
              fromDiffError: (data: UpdateProjectDiffResult) => ({
                remote: data.result.remoteProject,
                local: data.result.localProject,
              }),
              fromVariables: (vars: UpdateProjectFormVariables) => vars.data,
              toVariables: (vars: UpdateProjectFormVariables, patch: ProjectUpdateType) => ({
                ...vars,
                data: { ...vars.data, ...patch },
              }),
            },
          },
        },
        variables: {
          vid: blankProjectId,
          data: {
            ...changes,
            ...status,
            version: version || 1,
          },
        },
      });

      if (updateProjectBlankResult.data?.updateProject?.result?.__typename === 'Error') {
        const inlineUpdateProjectError = updateProjectBlankResult.data?.updateProject?.result;

        if (inlineUpdateProjectError?.code === 'PROJECT_NAME_ALREADY_EXISTS') {
          errors.name = inlineUpdateProjectError.message;
        }
      }

      const shouldProjectCreate =
        updateProjectBlankResult.data?.updateProject?.result?.__typename === 'Project' &&
        values.status === ProjectStatusEnum.Unpublished;

      if (shouldProjectCreate) {
        notifications.add({
          key: `${blankProjectId}-create`,
          status: 'success',
          autoClose: 3,
          message: 'Проект успешно создан',
          onClose(item) {
            notifications.remove(item.key);
          },
        });
        setIsNavigationBlocked(false);
        history.push(`/projects/show/${blankProjectId}`);
      }

      form.initialize((v) => {
        if (updateProjectBlankResult.data?.updateProject?.result?.__typename === 'Project') {
          const initials = getInitialValues(updateProjectBlankResult.data.updateProject.result);
          return { ...initials, ...v };
        }

        return v;
      });

      return errors;
    },
    [blankProjectId, history, notifications, queryProjectData, updateProjectBlank],
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
    createBlankProjectError ||
    deleteProjectError ||
    queryRegionListError ||
    updateProjectBlankError ||
    queryProjectError;

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

  if (queryProjectLoading || createBlankProjectLoading || queryRegionListLoading) {
    return <Loader />;
  }

  if (queryProjectData?.project?.__typename === 'Error') {
    const inlineQueryProjectError = queryProjectData.project;

    const is404 = inlineQueryProjectError.code === 'PROJECT_NOT_FOUND';

    if (is404) {
      return null;
    }

    notifications.add({
      key: `${inlineQueryProjectError.code}-query-error`,
      status: 'alert',
      message: inlineQueryProjectError.message,
    });

    return null;
  }

  const initialValues =
    queryProjectData?.project?.__typename !== 'Project' || !queryProjectData?.project
      ? undefined
      : getInitialValues(queryProjectData?.project);

  return (
    <div className={cnPage()}>
      <ProjectForm
        mode="create"
        referenceData={referenceData}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
      <RouteLeavingGuard when={isNavigationBlocked} navigate={handleNavigation} />
    </div>
  );
};
