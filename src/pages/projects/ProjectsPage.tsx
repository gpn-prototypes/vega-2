import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, IconEdit, IconTrash, Modal, Text } from '@gpn-prototypes/vega-ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/ru';

import { namedOperations, UpdateProject, UpdateProjectDiff } from '../../__generated__/types';
import { useBrowserTabActivity } from '../../hooks';
import { useNotifications } from '../../providers/notifications';

import {
  ProjectsTableList,
  useDeleteProject,
  useProjectsTableList,
  useProjectToggleFavorite,
} from './__generated__/projects';
import { MenuItemProps, TableRow } from './ProjectsTable/types';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ProjectsPageView } from './ProjectsPageView';

dayjs.locale('ru');
dayjs.extend(utc);

interface UpdateProjectDiffResult extends UpdateProject {
  result: Required<UpdateProjectDiff>;
}

const projectsMapper = (updateProjectData: ProjectsTableList): TableRow[] => {
  if (updateProjectData.projects?.__typename !== 'ProjectList') {
    return [];
  }

  const projects = updateProjectData.projects.data ?? [];

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

const TABLE_POLLING_INTERVAL_MS = 1000 * 30;

export const ProjectsPage = (): React.ReactElement => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [dataDeleteProject, setDataDeleteProject] = React.useState<TableRow | null>(null);

  const notifications = useNotifications();
  const history = useHistory();

  const [deleteProject] = useDeleteProject({
    refetchQueries: [namedOperations.Query.ProjectsTableList],
    awaitRefetchQueries: true,
  });

  const { data, loading, startPolling, stopPolling, refetch } = useProjectsTableList({
    fetchPolicy: 'network-only',
    pollInterval: TABLE_POLLING_INTERVAL_MS,
  });

  useBrowserTabActivity({
    onActivated() {
      refetch();
      startPolling(TABLE_POLLING_INTERVAL_MS);
    },
    onHidden() {
      stopPolling();
    },
  });

  const [toggleFavorite] = useProjectToggleFavorite({
    refetchQueries: [namedOperations.Query.ProjectsTableList],
    awaitRefetchQueries: true,
  });

  const handelToggleFavorite = React.useCallback(
    async (id: string, payload: { isFavorite: boolean; version: number }) => {
      const addToFavoriteResult = await toggleFavorite({
        context: {
          projectDiffResolving: {
            maxAttempts: 5,
            projectAccessor: {
              fromDiffError: (mutationData: UpdateProjectDiffResult) => ({
                local: mutationData.result.localProject,
                remote: mutationData.result.remoteProject,
              }),
            },
          },
        },
        variables: {
          vid: id,
          isFavorite: payload.isFavorite,
          version: payload.version,
        },
      });

      if (addToFavoriteResult.data?.updateProject?.result?.__typename === 'Error') {
        const addToFavoriteError = addToFavoriteResult.data?.updateProject?.result;

        notifications.add({
          key: `${addToFavoriteError.code}-add-to-favorite`,
          status: 'alert',
          message: addToFavoriteError.message,
          onClose(item) {
            notifications.remove(item.key);
          },
        });
      }
    },
    [notifications, toggleFavorite],
  );

  const isLoading = loading && !data?.projects;

  const mappedProjects = data?.projects?.__typename !== 'ProjectList' ? [] : projectsMapper(data);

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
            setDataDeleteProject(project);
            close();
            setIsOpenModal(true);
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
      <ProjectsPageView
        projects={projects}
        isLoading={isLoading}
        onFavorite={handelToggleFavorite}
      />
      <Modal
        hasOverlay
        hasCloseButton
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
        }}
        className={cn('Modal').toString()}
      >
        <Modal.Header>
          <Text size="xs">Удаление проекта</Text>
        </Modal.Header>
        <Modal.Body>
          <Text
            className={cn('ModalContent').toString()}
          >{`Вы уверены, что хотите удалить проект «${dataDeleteProject?.name}» из\u00A0системы?`}</Text>
        </Modal.Body>
        <Modal.Footer className={cn('ModalFooter').toString()}>
          <Button
            size="m"
            onClick={() => {
              setIsOpenModal(false);
              setDataDeleteProject(null);
            }}
            view="primary"
            label="Нет, оставить"
            className={cn('ButtonCancel').toString()}
          />
          <Button
            size="m"
            onClick={() => {
              if (dataDeleteProject) {
                deleteProject({ variables: { vid: dataDeleteProject.id } }).then(() => {
                  setIsOpenModal(false);
                  notifications.add({
                    autoClose: 3,
                    key: `${dataDeleteProject.id}-system`,
                    status: 'success',
                    message: `Проект «${dataDeleteProject.name}» успешно удален.`,
                    onClose(item) {
                      notifications.remove(item.key);
                    },
                  });
                  setDataDeleteProject(null);
                });
              }
            }}
            view="ghost"
            label="Да, удалить"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
