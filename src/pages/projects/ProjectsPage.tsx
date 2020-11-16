import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconEdit, IconTrash, Text } from '@gpn-prototypes/vega-ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/ru';

import { Project } from '../../__generated__/types';
import { useSnackbar } from '../../providers/snackbar';

import { useDeleteProject, useGetProjects, useUpdateProject } from './__generated__/projects';
import { MenuItemProps, TableRow } from './ProjectsTable/types';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ProjectsPageView } from './ProjectsPageView';

dayjs.locale('ru');
dayjs.extend(utc);

type ProjectsMapper = Pick<
  Project,
  | 'vid'
  | 'name'
  | 'isFavorite'
  | 'region'
  | 'attendees'
  | 'createdBy'
  | 'createdAt'
  | 'editedAt'
  | 'version'
  | 'status'
  | 'description'
> | null;

const projectsMapper = (projects: ProjectsMapper[] | undefined | null = []): TableRow[] => {
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

export const ProjectsPage = (): React.ReactElement => {
  const { addItem, removeItem } = useSnackbar();

  const history = useHistory();

  const [deleteProject] = useDeleteProject({
    refetchQueries: [`GetProjects`],
    awaitRefetchQueries: true,
  });
  const { data, loading } = useGetProjects({
    fetchPolicy: 'network-only',
  });
  const [updateProject] = useUpdateProject({
    refetchQueries: [`GetProjects`],
  });

  const addToFavorite = React.useCallback(
    (id, payload) => {
      updateProject({ variables: { vid: id, data: payload } });
    },
    [updateProject],
  );

  const isLoading = loading && !data?.projects;

  const mappedProjects =
    data?.projects?.__typename !== 'ProjectList' ? [] : projectsMapper(data?.projects.data);

  const projects = mappedProjects.map((project) => {
    const edit = ({ close, ...rest }: MenuItemProps) => {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/projects/show/${project.id}`);
            close();
          }}
          {...rest}
        >
          <span className={cn('MenuIcon')}>
            <IconEdit size="s" />
          </span>
          <Text>Редактировать</Text>
        </button>
      );
    };

    const remove = ({ close, ...rest }: MenuItemProps) => {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              key: `${project.id}-alert`,
              message: `Вы уверены, что хотите удалить проект «${project.name}» из системы?`,
              status: 'alert',
              actions: [
                {
                  label: 'Да, удалить',
                  onClick(): void {
                    deleteProject({ variables: { vid: project.id } }).then(() => {
                      addItem({
                        autoClose: 3,
                        key: `${project.id}-system`,
                        status: 'success',
                        message: `Проект «${project.name}» успешно удален.`,
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
      <ProjectsPageView projects={projects} isLoading={isLoading} onFavorite={addToFavorite} />
    </>
  );
};
