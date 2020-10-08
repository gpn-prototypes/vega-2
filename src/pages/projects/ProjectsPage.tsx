import React from 'react';
import { useMount } from '@gpn-prototypes/vega-ui';

import { useGetProjectsQuery } from '../../generated/graphql';
import { DataLayout } from '../../layouts/DataLayout';

import { ProjectsPageView } from './ProjectsPageView';

export const ProjectsPage = (): React.ReactElement => {
  const getProjectsQuery = useGetProjectsQuery();

  // useMount(() => {
  //   getProjectsQuery.refetch()
  // })

  console.log(getProjectsQuery.data);

  return (
    <DataLayout<typeof getProjectsQuery['data']> {...getProjectsQuery}>
      <ProjectsPageView data={getProjectsQuery.data} />
    </DataLayout>
  );
};
