import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/ru';

import { ProjectsTableList } from '../../pages/projects/__generated__/projects';
import { TableRow } from '../../pages/projects/ProjectsTable/types';

dayjs.locale('ru');
dayjs.extend(utc);

export const projectsMapper = (projectListData: ProjectsTableList): TableRow[] => {
  if (projectListData.projects?.__typename !== 'ProjectList') {
    return [];
  }

  const projects = projectListData.projects.data ?? [];

  return projects?.flatMap((project) => {
    if (project === null) {
      return [];
    }

    const roles = project.attendees
      ?.map((a) => a?.roles)
      ?.map((rs) => rs?.map((r) => r?.name).join(''))
      .join(', ');

    const createdAt = project.createdAt
      ? dayjs.utc(project.createdAt).local().format('D MMMM YYYY')
      : undefined;

    const editedAt = project.editedAt
      ? {
          date: dayjs.utc(project.editedAt).local().format('D MMMM YYYY'),
          time: dayjs.utc(project.editedAt).local().format(', H:mm'),
        }
      : undefined;

    return {
      id: project.vid ?? 'wtf-id',
      name: project.name ?? undefined,
      version: project.version ?? undefined,
      status: project.status ?? undefined,
      description: project.description ?? undefined,
      isFavorite: project.isFavorite ?? undefined,
      region: project.region?.name ?? undefined,
      roles: roles ?? undefined,
      createdBy: project?.createdBy?.name ?? undefined,
      createdAt,
      editedAt,
    };
  });
};
