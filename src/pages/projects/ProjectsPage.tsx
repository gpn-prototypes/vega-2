import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconEdit, IconTrash, Text } from '@gpn-prototypes/vega-ui';

import { namedOperations, UpdateProject, UpdateProjectDiff } from '../../__generated__/types';
import { useBrowserTabActivity } from '../../hooks';
import { useNotifications } from '../../providers/notifications';
import { projectsMapper } from '../../utils/projects-mapper';

import {
  useDeleteProject,
  useProjectsTableList,
  useProjectToggleFavorite,
} from './__generated__/projects';
import { MenuItemProps, TableRow } from './ProjectsTable/types';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ModalDeleteProject } from './ModalDeleteProject';
import { ProjectsPageView } from './ProjectsPageView';

interface UpdateProjectDiffResult extends UpdateProject {
  result: Required<UpdateProjectDiff>;
}

const testId = {
  projectRemove: 'ProjectsPage:button:remove',
  projectEdit: 'ProjectsPage:button:edit',
} as const;

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
                local: { vid: id, isFavorite: !payload.isFavorite, version: payload.version },
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
          data-testid={testId.projectEdit}
        >
          <span className={cn('MenuIcon')}>
            <IconEdit size="s" />
          </span>
          <Text as="span">Редактировать</Text>
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
          data-testid={testId.projectRemove}
        >
          <span className={cn('MenuIcon')}>
            <IconTrash size="s" />
          </span>
          <Text as="span">Удалить</Text>
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

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleCancelDelete = () => {
    setIsOpenModal(false);
    setDataDeleteProject(null);
  };

  const handleDeleteProject = () => {
    /* istanbul ignore else */
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
  };

  return (
    <>
      <ProjectsPageView
        projects={projects}
        isLoading={isLoading}
        onFavorite={handelToggleFavorite}
      />
      <ModalDeleteProject
        projectName={dataDeleteProject?.name}
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onCancelDelete={handleCancelDelete}
        onDeleteProject={handleDeleteProject}
      />
    </>
  );
};

ProjectsPage.testId = testId;
