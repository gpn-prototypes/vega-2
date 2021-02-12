import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@gpn-prototypes/vega-ui';
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
import { useNotifications } from '../../providers/notifications';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import {
  projectFormFields,
  UpdateProjectFormVariables,
  useProjectFormFields,
  useProjectFormRegionList,
  useUpdateProjectForm,
} from './__generated__/project';
import { cnPage } from './cn-page';
import { extractProjectValidationErrors } from './extract-project-validation-errors';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type ParamsType = {
  projectId: string;
};

type PageProps = Record<string, unknown>;

type ProjectFormFields = projectFormFields;

type FormKeys = keyof FormValues;
interface UpdateProjectDiffResult extends UpdateProject {
  result: Required<UpdateProjectDiff>;
}

const getInitialValues = (project: ProjectFormFields): FormValues => {
  return {
    name: project.name ?? '',
    type: project.type ?? ProjectTypeEnum.Geo,
    region: project.region?.vid ?? null,
    coordinates: project.coordinates ?? '',
    description: project.description ?? '',
    yearStart: project.yearStart ?? undefined,
    status: project.status ?? ProjectStatusEnum.Unpublished,
  };
};

const FORM_FIELDS_POLLING_MS = 1000 * 30;

export const EditProjectPage: React.FC<PageProps> = () => {
  const { projectId } = useParams<ParamsType>();
  const notifications = useNotifications();

  const [unsavedChanges, setUnsavedChanges] = useState<Partial<FormValues>>({});

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
      vid: projectId,
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

  const [updateProject, { error: updateProjectError }] = useUpdateProjectForm();

  const {
    data: queryRegionListData,
    error: queryRegionListError,
    loading: queryRegionListLoading,
  } = useProjectFormRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = React.useCallback(
    async (values: FormValues, form: FormApi<FormValues>) => {
      const state = form.getState();

      const changes = Object.keys(state.dirtyFields)
        .map((key) => ({ key, value: getIn(values, key) }))
        .reduce(
          (acc, { key, value }) =>
            setIn(acc, key, typeof value === 'string' ? value.trim() : value),
          {},
        );

      const version =
        queryProjectData?.project?.__typename === 'Project'
          ? queryProjectData?.project?.version
          : 1;

      const updateProjectResult = await updateProject({
        context: {
          projectDiffResolving: {
            maxAttempts: 5,
            projectAccessor: {
              fromDiffError: (data: UpdateProjectDiffResult) => ({
                remote: data.result.remoteProject,
                local: queryProjectData?.project,
              }),
              fromVariables: (vars: UpdateProjectFormVariables) => vars.data,
              toVariables: (vars: UpdateProjectFormVariables, patched: ProjectUpdateType) => ({
                ...vars,
                data: { ...vars.data, ...patched },
              }),
            },
          },
        },
        variables: {
          vid: projectId,
          data: {
            ...unsavedChanges,
            ...changes,
            version: version || 1,
          },
        },
      });

      switch (updateProjectResult.data?.updateProject?.result?.__typename) {
        case 'Project':
          if (Object.keys(unsavedChanges).length > 0) {
            setUnsavedChanges({});
          }
          notifications.add({
            key: `${projectId}-create`,
            status: 'success',
            autoClose: 3,
            message: 'Изменения успешно сохранены',
            onClose(item) {
              notifications.remove(item.key);
            },
          });

          form.initialize(getInitialValues(updateProjectResult.data.updateProject.result));
          break;
        case 'ValidationError': {
          const updatedUnsavedChanges = { ...unsavedChanges, ...changes };
          const actual = await refetchProjectFormFields();

          if (actual.data.project?.__typename === 'Project') {
            form.initialize(getInitialValues(actual.data.project));
          }
          const validationErrors = extractProjectValidationErrors(
            updateProjectResult.data?.updateProject?.result as ValidationError,
          );

          const formKeys: FormKeys[] = Object.keys(updatedUnsavedChanges) as FormKeys[];

          formKeys.forEach((name) => {
            if (validationErrors[name] !== undefined && updatedUnsavedChanges[name] !== undefined) {
              delete updatedUnsavedChanges[name];
            }
          });

          setUnsavedChanges(updatedUnsavedChanges);
          return validationErrors;
        }
        case 'UpdateProjectDiff':
          console.warn(
            'UpdateProjectDiff mutation result should be processed at graphql interceptor level',
          );
          break;
        default: {
          const commonError = updateProjectResult.data?.updateProject?.result as ErrorInterface;
          setUnsavedChanges({ ...unsavedChanges, ...changes });
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
    [
      notifications,
      projectId,
      unsavedChanges,
      queryProjectData,
      updateProject,
      refetchProjectFormFields,
    ],
  );

  const apolloError = queryProjectError || queryRegionListError || updateProjectError;

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

  if (queryProjectLoading || queryRegionListLoading) {
    return <Loader />;
  }

  const initialValues =
    queryProjectData?.project?.__typename !== 'Project' || !queryProjectData?.project
      ? undefined
      : getInitialValues(queryProjectData?.project);

  const resetFormInInitialValues = (form: FormApi<FormValues>, values: FormValues) => {
    form.reset();
    form.initialize(values);
  };

  return (
    <div className={cnPage()}>
      <ProjectForm
        mode="edit"
        referenceData={referenceData}
        initialValues={initialValues}
        onCancel={(form) => {
          refetchProjectFormFields().then((response) => {
            if (response.data?.project?.__typename === 'Project') {
              resetFormInInitialValues(form, getInitialValues(response.data.project));
            }
          });
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
