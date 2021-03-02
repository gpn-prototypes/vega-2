import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, useMount } from '@gpn-prototypes/vega-ui';
import { FormApi, getIn, setIn } from 'final-form';

import {
  ErrorInterface,
  ProjectStatusEnum,
  ProjectTypeEnum,
  ProjectUpdateType,
  UpdateProject,
  UpdateProjectDiff,
  ValidationError,
} from '../../__generated__/types';
import { useBrowserTabActivity } from '../../hooks';
import { useBus } from '../../providers/bus';
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
import { extractProjectValidationErrors } from './extract-project-validation-errors';
import { RouteLeavingGuard } from './RouteLeavingGuard';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type PageProps = Record<string, unknown>;

type ProjectType = projectFormFields;
interface UpdateProjectDiffResult extends UpdateProject {
  result: Required<UpdateProjectDiff>;
}

const getInitialValues = (project: ProjectType): FormValues => {
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
  const bus = useBus();

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
    const draftUnsub = bus.subscribe({ channel: 'project-draft', topic: 'delete' }, () => {
      setIsNavigationBlocked(false);
      history.push('/projects');
    });

    call();

    return () => {
      draftUnsub();
    };
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
      vid: blankProjectId as string,
    },
    skip: blankProjectId === undefined,
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

  useEffect(() => {
    if (
      queryProjectData?.project?.__typename === 'Project' &&
      queryProjectData.project.status === ProjectStatusEnum.Unpublished
    ) {
      setIsNavigationBlocked(false);
      history.push(`/projects/show/${blankProjectId}`);
    }
  }, [queryProjectData, history, blankProjectId, isNavigationBlocked]);

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
      const changes = Object.keys(state.dirtyFields)
        .map((key) => ({ key, value: getIn(values, key) }))
        .reduce(
          (acc, { key, value }) =>
            // formatOnBlur может не сработать при сабмите
            setIn(acc, key, typeof value === 'string' ? value.trim() : value),
          {},
        );

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
                local: queryProjectData?.project,
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

      switch (updateProjectBlankResult.data?.updateProject?.result?.__typename) {
        case 'Project': {
          if (values.status === ProjectStatusEnum.Unpublished) {
            notifications.add({
              key: `${blankProjectId}-create`,
              status: 'success',
              autoClose: 3,
              message: 'Проект успешно создан',
              onClose(item) {
                notifications.remove(item.key);
              },
            });
          }
          break;
        }
        case 'ValidationError':
          return extractProjectValidationErrors(
            updateProjectBlankResult.data?.updateProject?.result as ValidationError,
          );
        case 'UpdateProjectDiff':
          // eslint-disable-next-line no-console
          console.warn(
            'UpdateProjectDiff mutation result should be processed at graphql interceptor level',
          );
          break;
        default: {
          const commonError = updateProjectBlankResult.data?.updateProject
            ?.result as ErrorInterface;
          notifications.add({
            key: `${commonError.code}-create`,
            status: 'alert',
            message: commonError.message,
            onClose(item) {
              notifications.remove(item.key);
            },
          });
          break;
        }
      }
      return {};
    },
    [blankProjectId, notifications, queryProjectData, updateProjectBlank],
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

    bus.send({
      channel: 'project-draft',
      topic: 'delete',
      self: false,
      broadcast: true,
    });

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
    return <Loader aria-label="Загрузка" />;
  }

  // TODO: Решится в задаче VEGA-820
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
