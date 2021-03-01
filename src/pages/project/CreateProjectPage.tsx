import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  useUpdateProjectStatus,
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

type ErrorResult = { __typename: string } | ({ __typename: 'Error' } & ErrorInterface);

type ErrorMap = Record<string, string | undefined>;

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

  const version = useRef(1);

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
        view: 'alert',
        body: inlineCreateProjectError.message,
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
    onCompleted: (data) => {
      if (data.project?.__typename === 'Project' && data.project.version) {
        version.current = data.project.version;
      }
    },
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

  const [updateProjectStatus, { error: updateProjectStatusError }] = useUpdateProjectStatus();

  const {
    data: queryRegionListData,
    loading: queryRegionListLoading,
    error: queryRegionListError,
  } = useProjectFormRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleResponseError = useCallback(
    (result: ErrorResult): ErrorMap => {
      switch (result.__typename) {
        case 'ValidationError':
          return extractProjectValidationErrors(result as ValidationError);
        case 'UpdateProjectDiff':
          // eslint-disable-next-line no-console
          console.warn(
            'UpdateProjectDiff mutation result should be processed at graphql interceptor level',
          );
          break;
        default: {
          const commonError = result as ErrorInterface;
          notifications.add({
            view: 'alert',
            body: commonError.message,
          });
          break;
        }
      }

      return {};
    },
    [notifications],
  );

  const handleFormSubmit = useCallback(
    async (values: FormValues, form: FormApi<FormValues>) => {
      const projectDiffResolvingContext = {
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
      };
      const state = form.getState();
      const changes = Object.keys(state.dirtyFields)
        .map((key) => ({ key, value: getIn(values, key) }))
        .reduce(
          (acc, { key, value }) =>
            // formatOnBlur может не сработать при сабмите
            setIn(acc, key, typeof value === 'string' ? value.trim() : value),
          {},
        );

      if (Object.keys(changes).length > 0) {
        const updateProjectBlankResult = await updateProjectBlank({
          context: {
            ...projectDiffResolvingContext,
          },
          variables: {
            vid: blankProjectId,
            data: {
              ...changes,
              version: version.current,
            },
          },
        });
        if (updateProjectBlankResult?.data?.updateProject?.result) {
          const { result } = updateProjectBlankResult.data.updateProject;

          if (result.__typename === 'Project') {
            if (result.version) {
              version.current = result.version;
            }
          }
          if (result.__typename !== 'Project') {
            const errors = handleResponseError(result);

            if (Object.keys(errors).length > 0) {
              return errors;
            }
          }
        }
      }

      if (values.status && values.status === ProjectStatusEnum.Unpublished && blankProjectId) {
        const result = await updateProjectStatus({
          context: {
            ...projectDiffResolvingContext,
          },
          variables: {
            vid: blankProjectId,
            data: {
              version: version.current,
              status: values.status,
            },
          },
        });

        if (
          result.data?.updateProjectStatus?.result &&
          result.data.updateProjectStatus.result.__typename !== 'Project'
        ) {
          const { result: updateProjectStatusResult } = result.data.updateProjectStatus;
          const errors = handleResponseError(updateProjectStatusResult);
          if (Object.keys(errors).length > 0) {
            return errors;
          }
        }

        notifications.add({
          view: 'success',
          autoClose: 3,
          body: 'Проект успешно создан',
        });
      }
      return {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateProjectBlank, blankProjectId, updateProjectStatus, handleResponseError, notifications],
  );

  const handleCancel = () => {
    history.push('/projects');
  };

  const handleNavigation = async (path: string | null) => {
    const deleteProjectResult = await deleteProject({ variables: { vid: blankProjectId } });

    if (deleteProjectResult.data?.deleteProject?.result?.__typename === 'Error') {
      const inlineDeleteProjectError = deleteProjectResult.data?.deleteProject?.result;

      notifications.add({
        view: 'alert',
        body: inlineDeleteProjectError.message,
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
    updateProjectStatusError ||
    queryProjectError;

  if (apolloError) {
    notifications.add({
      view: 'alert',
      body: apolloError.message,
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
      view: 'alert',
      body: inlineQueryProjectError.message,
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
      <RouteLeavingGuard
        when={isNavigationBlocked}
        whiteRoutes={['/projects/show/:projectId', '/login']}
        navigate={handleNavigation}
      />
    </div>
  );
};
