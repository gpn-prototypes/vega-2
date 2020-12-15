import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@gpn-prototypes/vega-ui';
import { FormApi, getIn, setIn } from 'final-form';

import {
  Project,
  ProjectTypeEnum,
  ProjectUpdateType,
  UpdateProject,
  UpdateProjectDiff,
} from '../../__generated__/types';
import { useNotifications } from '../../providers/notifications';
import { FormValues, ProjectForm } from '../../ui/features/projects';

import {
  UpdateProjectFormVariables,
  useProjectFormFields,
  useProjectFormRegionList,
  useUpdateProjectForm,
} from './__generated__/project';
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
  };
};

export const EditProjectPage: React.FC<PageProps> = () => {
  const { projectId } = useParams<ParamsType>();
  const notifications = useNotifications();

  const {
    data: queryProjectData,
    loading: queryProjectLoading,
    error: queryProjectError,
  } = useProjectFormFields({
    pollInterval: 1000 * 30,
    variables: {
      vid: projectId,
    },
  });

  const [updateProject, { error: updateProjectError }] = useUpdateProjectForm();

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

      const updateProjectResult = await updateProject({
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
          vid: projectId,
          data: {
            ...changes,
            version: version || 1,
          },
        },
      });

      if (updateProjectResult.data?.updateProject?.result?.__typename === 'Error') {
        const inlineUpdateProjectError = updateProjectResult.data?.updateProject?.result;

        if (inlineUpdateProjectError?.code === 'PROJECT_NAME_ALREADY_EXISTS') {
          errors.name = inlineUpdateProjectError.message;
        }

        if (inlineUpdateProjectError?.code === 'PROJECT_YEARSTART_CANNOT_BE_NULL') {
          errors.yearStart = inlineUpdateProjectError.message;
        }
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

      form.initialize((v) => {
        if (updateProjectResult.data?.updateProject?.result?.__typename === 'Project') {
          const initials = getInitialValues(updateProjectResult.data.updateProject.result);
          return { ...initials, ...v };
        }

        return v;
      });

      return errors;
    },
    [notifications, projectId, queryProjectData, updateProject],
  );

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
