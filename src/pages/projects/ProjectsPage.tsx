import React from 'react';

import { useGetProjects } from './__generated__/projects';
import { ProjectsPageView } from './ProjectsPageView';

export const ProjectsPage = (): React.ReactElement => {
  const { data, loading } = useGetProjects();

  return <ProjectsPageView data={data} loading={loading} />;
};
