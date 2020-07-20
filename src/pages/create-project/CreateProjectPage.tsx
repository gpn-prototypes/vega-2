import React from 'react';
import { PageBanner } from '@gpn-prototypes/vega-ui';

import { ProjectForm } from '../../components/ProjectForm';

import { cnPage } from './cn-page';

import './CreateProjectPage.css';

type PageProps = {};

export const CreateProjectPage: React.FC<PageProps> = () => {
  return (
    <div className={cnPage()}>
      <PageBanner title="Усть-Енисей" description="Россия, Ямало-Ненецкий АО, Усть-Енисей" />
      <ProjectForm />
    </div>
  );
};
