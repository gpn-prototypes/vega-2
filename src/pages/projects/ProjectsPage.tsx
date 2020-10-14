import React from 'react';

import { useGetProjects } from './__generated__/projects';
import { ProjectsPageView } from './ProjectsPageView';

export const ProjectsPage = (): React.ReactElement => {
  const getProjectsQuery = useGetProjects();

  return <ProjectsPageView data={getProjectsQuery.data} />;
};
