import React from 'react';
import { Loader } from '@gpn-prototypes/vega-ui';

import { ProjectForm } from '../../ui/features/projects';

import { CreateProjectVariables, useQueryRegionList } from './__generated__/project';
import { cnPage } from './cn-page';
import { ReferenceDataType } from './types';

import './ProjectPage.css';

type PageProps = Record<string, unknown>;

export const EditProjectPage: React.FC<PageProps> = () => {
  const { data: queryRegionListData, loading: isQueryRegionListLoading } = useQueryRegionList();

  const referenceData: ReferenceDataType = { regionList: queryRegionListData?.regionList };

  const handleFormSubmit = (values: CreateProjectVariables) => {
    // eslint-disable-next-line no-console
    console.log('handleFormSubmit', values);
  };

  if (isQueryRegionListLoading) {
    return <Loader />;
  }

  const initialValues = {
    description: {
      name: 'Усть-Енисей',
      region: 'Ямало-Ненецкий АО',
      type: 'Геологоразведочный',
      coordinates: 'Декартова система',
      description:
        'Краткое описание проекта поможет отличать ваши проекты среди остальных и находить похожие',
    },
  };

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
