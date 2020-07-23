import React from 'react';
import { PageBanner } from '@gpn-prototypes/vega-ui';

import { ProjectForm } from '../../components/ProjectForm';

import { cnPage } from './cn-page';

import './CreateProjectPage.css';

type PageProps = {};

export const CreateProjectPage: React.FC<PageProps> = () => {
  return (
    <div className={cnPage()}>
      <PageBanner title="Новый проект" description="Россия, Регион" />
      <ProjectForm />
    </div>
  );
};
