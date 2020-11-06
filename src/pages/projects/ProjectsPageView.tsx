import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  ChoiceGroup,
  IconBookmarkFilled,
  IconEdit,
  IconProps,
  IconSearch,
  IconTrash,
  Loader,
  SnackBar,
  Text,
  TextField,
  usePortal,
  usePortalRender,
} from '@gpn-prototypes/vega-ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/ru';

import { Project } from '../../__generated__/types';

import { GetProjects, useDeleteProject } from './__generated__/projects';
import { cnProjectsPage as cn } from './cn-projects-page';
import { MenuItemProps, ProjectsTable, ProjectsTableRow } from './ProjectsTable';
import { useSnackbar } from './use-snackbar';

import './ProjectsPage.css';

dayjs.locale('ru');
dayjs.extend(utc);

type Item = {
  name: string;
  icon?: React.FC<IconProps>;
};

const filterItems = [
  {
    name: 'Мои',
  },
  {
    name: 'Избранные',
    icon: IconBookmarkFilled,
  },
  {
    name: 'Последние',
  },
  {
    name: 'Все',
  },
] as Item[];

type TextFieldOnChangeArgs = {
  value: string | null;
  name?: string;
  e: React.ChangeEvent;
  id?: string | number;
};

type ProjectFilterType = {
  onInputSearch(value: string | null): void;
  onChangeFilter(value: Item | null): void;
};

const testId = {
  root: 'ProjectsPage:root',
};

const ProjectFilter: React.FC<ProjectFilterType> = ({ onInputSearch, onChangeFilter }) => {
  const [searchValue, setSearchValue] = React.useState<string | null>(null);
  const [filterValue, setFilterValue] = React.useState<Item | null>(null);

  const handleFilter = ({ value }: { value: Item | null }): void => {
    setFilterValue(value);
    onChangeFilter(value);
  };

  return (
    <div className={cn('Filter')}>
      <ChoiceGroup<Item>
        size="s"
        value={filterValue}
        items={filterItems}
        getLabel={(item): string => item.name}
        getIcon={(item): React.FC<IconProps> | undefined => item.icon}
        onChange={handleFilter}
        name="ChoiceGroup"
        multiple={false}
      />
      <div className={cn('FilterField')}>
        <TextField
          value={searchValue}
          onChange={({ value }: TextFieldOnChangeArgs): void => {
            setSearchValue(value);
            onInputSearch(value);
          }}
          size="s"
          leftSide={IconSearch}
          width="full"
          placeholder="Введите название проекта или имя автора"
        />
      </div>
    </div>
  );
};

type Props = {
  data?: GetProjects;
  loading?: boolean;
};

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

export const ProjectsPageView: React.FC<Props> = (props) => {
  const mappedProjects =
    props.data?.projects?.__typename !== 'ProjectList'
      ? []
      : projectsMapper(props.data?.projects.data);

  const isLoading = props.loading && !props.data;

  const [items, { addItem, removeItem }] = useSnackbar();

  const { renderPortalWithTheme } = usePortalRender();
  const { portal } = usePortal({ name: 'snackbar', className: cn('PortalSnackBar') });

  const [deleteProject] = useDeleteProject({
    refetchQueries: [`GetProjects`],
    awaitRefetchQueries: true,
  });

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

  // TODO: Поправить условие, когда можно будет получить общее количество проектов и сделают пагинацию
  const visibleLoadMore = projects.length > 20;

  const table = (
    <div className={cn('Table')}>
      <ProjectsTable
        rows={projects}
        onFavorite={(id) => {
          // eslint-disable-next-line no-console
          console.log(id);
        }}
      />
      {visibleLoadMore && (
        <div className={cn('LoadMore')}>
          <Button view="ghost" width="full" label="Загрузить ещё" size="l" />
        </div>
      )}
    </div>
  );

  return (
    <div data-testid={testId.root} className={cn()}>
      <div className={cn('Container')}>
        <div className={cn('Header')}>
          <div className={cn('Heading')}>
            <Text as="h1" size="3xl" weight="bold" className={cn('Title').toString()}>
              Проекты
            </Text>
            <Text as="span" size="s" view="secondary" className={cn('SearchResult').toString()}>
              6 из 12
            </Text>
          </div>
          <Link to="/projects/create">
            <Button label="Создать новый проект" size="s" />
          </Link>
        </div>
        <div className={cn('Projects')}>
          <ProjectFilter
            // eslint-disable-next-line no-console
            onInputSearch={(value: string): void => console.log(`InputSearch: ${value}`)}
            // eslint-disable-next-line no-console
            onChangeFilter={(value: Item): void => console.log(`Filter: ${value.name}`)}
          />
        </div>
        {isLoading ? (
          <div className={cn('Loader')}>
            <Loader />
          </div>
        ) : (
          table
        )}
      </div>
      {portal &&
        renderPortalWithTheme(
          <SnackBar className={cn('SnackBar').toString()} items={items} />,
          portal,
        )}
    </div>
  );
};
