import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconEdit, IconTrash, Text } from '@gpn-prototypes/vega-ui';

import { ProjectOrderByEnum, SortType } from '../../__generated__/types';
import { useApp } from '../../App/app-context';
import { useBrowserTabActivity } from '../../hooks';
import { projectsMapper } from '../../utils/projects-mapper';

import {
  useDeleteProject,
  useMe,
  useProjectsTableList,
  useProjectToggleFavorite,
} from './__generated__/projects';
import { ColumnNames, MenuItemProps, SortData, TableRow } from './ProjectsTable/types';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ModalDeleteProject } from './ModalDeleteProject';
import { ProjectsPageView } from './ProjectsPageView';

const testId = {
  projectRemove: 'ProjectsPage:button:remove',
  projectEdit: 'ProjectsPage:button:edit',
} as const;

const TABLE_POLLING_INTERVAL_MS = 1000 * 30;
const PAGE_SIZE = 20;

export const ProjectsPage = (): React.ReactElement => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [dataDeleteProject, setDataDeleteProject] = React.useState<TableRow | null>(null);
  const [nextPageNumber, setNextPageNumber] = React.useState<number>(2);
  const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false);
  const [searchString, setSearchString] = React.useState<string | null>('');

  const { notifications } = useApp();
  const history = useHistory();

  const { data: meData } = useMe();

  const [currentSort, setCurrentSort] = React.useState(null as SortData | null);

  const getOrderBy = (sortOrder: 'asc' | 'desc'): SortType => {
    return sortOrder === 'asc' ? SortType.Asc : SortType.Desc;
  };

  const getSortBy = (sortingBy: keyof typeof ColumnNames): ProjectOrderByEnum => {
    const capitalizedColumnName = (sortingBy.charAt(0).toUpperCase() +
      sortingBy.slice(1)) as keyof typeof ProjectOrderByEnum;

    return ProjectOrderByEnum[capitalizedColumnName];
  };

  const { data, loading, startPolling, stopPolling, refetch, fetchMore } = useProjectsTableList({
    fetchPolicy: 'network-only',
    pollInterval: TABLE_POLLING_INTERVAL_MS,
    nextFetchPolicy: 'cache-first',
    variables: {
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      includeBlank: false,
      orderBy: currentSort?.sortingBy
        ? getSortBy(currentSort?.sortingBy)
        : meData?.me?.customSettings?.projectList?.orderBy,
      sortBy: currentSort?.sortOrder
        ? getOrderBy(currentSort?.sortOrder)
        : ((meData?.me?.customSettings?.projectList?.sortBy as unknown) as SortType),
      searchQuery: String(searchString).length >= 2 ? searchString : '',
    },
  });

  const currentQuantityProjects =
    data?.projects?.__typename === 'ProjectList' &&
    data.projects.data &&
    data?.projects?.data.length > 0
      ? data?.projects?.data.length
      : undefined;

  const totalQuantityProjects =
    data?.projects?.__typename === 'ProjectList' && data.projects.itemsTotal
      ? data.projects.itemsTotal
      : undefined;

  const handleSortProjects = React.useCallback(
    (sortOptions: SortData | null) => {
      if (sortOptions) {
        setCurrentSort(sortOptions);

        const { sortingBy, sortOrder } = sortOptions;

        const orderBy = getOrderBy(sortOrder);
        const sortBy = getSortBy(sortingBy);

        // TODO: После правки на бэке, изменить запрос refetch (информация ниже в комментарии)

        // На данный момент на бэкенде перепутаны названия аргументов: sortBy и orderBy
        // Т.е sortBy принимает 'asc' | 'desc', хотя это относится к порядку сортировки (orderBy)
        // Поэтому ниже можно увидеть расхождения { sortBy: orderBy, orderBy: sortBy }

        /* istanbul ignore else */
        if (totalQuantityProjects !== undefined || currentQuantityProjects) {
          refetch({
            sortBy: orderBy,
            orderBy: sortBy,
            pageNumber: 1,
            pageSize: totalQuantityProjects,
          });
        }

        return;
      }
      refetch({
        sortBy: SortType.Desc,
        orderBy: ProjectOrderByEnum.EditedAt,
        pageNumber: 1,
        pageSize: totalQuantityProjects ?? PAGE_SIZE,
      });
    },
    [refetch, totalQuantityProjects, currentQuantityProjects],
  );

  const refetchProjects = () => {
    const currentPageNumber = nextPageNumber - 1;
    const pageSize = totalQuantityProjects
      ? totalQuantityProjects - (totalQuantityProjects - currentPageNumber * PAGE_SIZE)
      : undefined;

    /* istanbul ignore else */
    if (pageSize !== undefined) {
      refetch({ pageNumber: 1, pageSize });
    }
  };

  const [deleteProject] = useDeleteProject({
    onCompleted: () => {
      refetchProjects();
    },
  });

  useBrowserTabActivity({
    onActivated() {
      refetchProjects();
      startPolling(TABLE_POLLING_INTERVAL_MS);
    },
    onHidden() {
      stopPolling();
    },
  });

  const [toggleFavorite] = useProjectToggleFavorite({
    onCompleted: () => {
      refetchProjects();
    },
  });

  const handleToggleFavorite = React.useCallback(
    async (id: string, payload: { isFavorite: boolean; version: number }) => {
      const addToFavoriteResult = await toggleFavorite({
        variables: {
          projectId: id,
          isFavorite: payload.isFavorite,
        },
      });

      /* istanbul ignore else */
      if (addToFavoriteResult.data?.setFavoriteProject?.__typename === 'Error') {
        const addToFavoriteError = addToFavoriteResult.data?.setFavoriteProject;

        notifications.add({
          view: 'alert',
          body: addToFavoriteError.message,
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
          view: 'success',
          body: `Проект «${dataDeleteProject.name}» успешно удален.`,
        });
        setDataDeleteProject(null);
      });
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);

    fetchMore({
      variables: { pageNumber: nextPageNumber, pageSize: PAGE_SIZE },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const prevData =
          prev.projects?.__typename === 'ProjectList' && prev.projects.data
            ? prev.projects.data
            : [];
        const resultData =
          fetchMoreResult.projects?.__typename === 'ProjectList' && fetchMoreResult.projects.data
            ? fetchMoreResult.projects.data
            : [];

        const prevItemsTotal =
          prev.projects?.__typename === 'ProjectList' ? prev.projects.itemsTotal : undefined;

        const resultItemsTotal =
          fetchMoreResult.projects?.__typename === 'ProjectList' &&
          fetchMoreResult.projects.itemsTotal
            ? fetchMoreResult.projects.itemsTotal
            : undefined;

        return {
          ...prev,
          ...fetchMoreResult,
          projects: {
            data: [...prevData, ...resultData],
            itemsTotal: resultItemsTotal ?? prevItemsTotal,
            __typename: 'ProjectList',
          },
        };
      },
    }).then(() => {
      setIsLoadingMore(false);
      setNextPageNumber(nextPageNumber + 1);
    });
  };

  return (
    <>
      <ProjectsPageView
        projects={projects}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onFavorite={handleToggleFavorite}
        onSort={handleSortProjects}
        counterProjects={{ current: currentQuantityProjects, total: totalQuantityProjects }}
        onLoadMore={handleLoadMore}
        setSearchString={setSearchString}
        searchString={searchString}
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
