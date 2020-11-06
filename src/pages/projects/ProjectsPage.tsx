import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconEdit,
  IconTrash,
  SnackBar,
  Text,
  usePortal,
  usePortalRender,
} from '@gpn-prototypes/vega-ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/ru';

import { Project } from '../../__generated__/types';

import { useDeleteProject, useGetProjects } from './__generated__/projects';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ProjectsPageView } from './ProjectsPageView';
import { MenuItemProps, ProjectsTableRow } from './ProjectsTable';
import { useSnackbar } from './use-snackbar';

dayjs.locale('ru');
dayjs.extend(utc);

type ProjectsMapper = Pick<
  Project,
  'vid' | 'name' | 'isFavorite' | 'region' | 'attendees' | 'createdBy' | 'createdAt' | 'editedAt'
> | null;

const projectsMapper = (projects: ProjectsMapper[] | undefined | null = []): ProjectsTableRow[] => {
  if (!projects) {
    return [];
  }

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

    const editedAt = project.editedAt ? (
      <div className={cn('EditedAt')}>
        <Text size="s">{dayjs.utc(project.editedAt).local().format('D MMMM YYYY')}</Text>
        <Text size="s" view="secondary">
          {dayjs.utc(project.editedAt).local().format(', H:mm')}
        </Text>
      </div>
    ) : undefined;

    return {
      id: project.vid ?? 'wtf-id',
      name: project.name ?? undefined,
      isFavorite: project.isFavorite ?? undefined,
      region: project.region?.name ?? undefined,
      roles: roles ?? undefined,
      createdBy: project?.createdBy?.name ?? undefined,
      createdAt,
      editedAt,
    };
  });
};

export const ProjectsPage = (): React.ReactElement => {
  const [items, { addItem, removeItem }] = useSnackbar();

  const [deleteProject] = useDeleteProject({
    refetchQueries: [`GetProjects`],
    awaitRefetchQueries: true,
  });
  const { data, loading } = useGetProjects({
    fetchPolicy: 'network-only',
  });

  const isLoading = loading && !data?.projects;

  const { renderPortalWithTheme } = usePortalRender();
  const { portal } = usePortal({ name: 'snackbar', className: cn('PortalSnackBar') });

  const mappedProjects =
    data?.projects?.__typename !== 'ProjectList' ? [] : projectsMapper(data?.projects.data);

  const projects = mappedProjects.map((project) => {
    const edit = ({ close, ...rest }: MenuItemProps) => {
      return (
        <Link to="/projects/create" onClick={() => close()} {...rest}>
          <span className={cn('MenuIcon')}>
            <IconEdit size="s" />
          </span>
          <Text>Редактировать</Text>
        </Link>
      );
    };

    const remove = ({ close, ...rest }: MenuItemProps) => {
      return (
        <button
          type="button"
          onClick={() => {
            addItem({
              key: `${project.id}-alert`,
              message: `Вы уверены, что хотите удалить проект "${project.name}" из системы?`,
              status: 'alert',
              actions: [
                {
                  label: 'Да, удалить',
                  onClick(): void {
                    deleteProject({ variables: { vid: project.id } }).then(() => {
                      addItem({
                        key: `${project.id}-system`,
                        status: 'system',
                        message: `Проект "${project.name}" успешно удален. Его можно найти в "Архиве".`,
                      });
                    });
                    removeItem(`${project.id}-alert`);
                  },
                },
                {
                  label: 'Нет, оставить',
                  onClick(): void {
                    removeItem(`${project.id}-alert`);
                  },
                },
              ],
            });
            close();
          }}
          {...rest}
        >
          <span className={cn('MenuIcon')}>
            <IconTrash size="s" />
          </span>
          <Text>Удалить</Text>
        </button>
      );
    };

    return {
      ...project,
      menu: [
        { key: `${project.id}-edit`, Element: edit },
        { key: `${project.id}-remove`, Element: remove },
      ],
    };
  });

  return (
    <>
      <ProjectsPageView projects={projects} isLoading={isLoading} />
      {portal &&
        renderPortalWithTheme(
          <SnackBar className={cn('SnackBar').toString()} items={items} />,
          portal,
        )}
    </>
  );
};
