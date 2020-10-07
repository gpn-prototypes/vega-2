import React from 'react';

import { useGetProjectsQuery } from '../../generated/graphql';
import { DataLayout } from '../../layouts/DataLayout';

import { ProjectsPageView } from './ProjectsPageView';

export const ProjectsPage = (): React.ReactElement => {
  const getProjectsQuery = useGetProjectsQuery();

  return (
    <DataLayout<typeof getProjectsQuery['data']> {...getProjectsQuery}>
      <ProjectsPageView data={getProjectsQuery.data} />
    </DataLayout>
  );
};
