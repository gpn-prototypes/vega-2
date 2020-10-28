import React from 'react';
import { useHistory } from 'react-router-dom';
import { Loader } from '@gpn-prototypes/vega-ui';

import { ProjectForm } from '../../ui/features/projects';

import {
  CreateProjectVariables,
  useCreateProject,
  useQueryRegionList,
} from './__generated__/project';
import { cnPage } from './cn-page';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type PageProps = Record<string, unknown>;

export const CreateProjectPage: React.FC<PageProps> = () => {
  const history = useHistory();

  const { data: queryRegionListData, loading: isQueryRegionListLoading } = useQueryRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const [
    createProject,
    { data: createProjectData, called: isCreateProjectCalled },
  ] = useCreateProject({
    onCompleted() {
      history.push('/projects');
    },
  });

  const handleFormSubmit = (values: CreateProjectVariables) => {
    createProject({ variables: values });
  };

  if (isCreateProjectCalled && createProjectData) {
    // eslint-disable-next-line no-console
    console.log({ createProjectData });
  }

  if (isQueryRegionListLoading) {
    return <Loader />;
  }

  return (
    <div className={cnPage()}>
      <ProjectForm mode="create" referenceData={referenceData} onSubmit={handleFormSubmit} />
    </div>
  );
};
