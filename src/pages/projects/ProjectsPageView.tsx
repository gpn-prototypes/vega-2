import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconProps } from '@gpn-design/uikit/Icon';
import {
  Button,
  ChoiceGroup,
  IconBookmarkFilled,
  Loader,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';
import dayjs from 'dayjs';

import 'dayjs/locale/ru';

import { GetProjects } from './__generated__/projects';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ProjectsTable, ProjectsTableRow } from './ProjectsTable';

import './ProjectsPage.css';

import { Project } from '@/__generated__/types';

dayjs.locale('ru');

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
      ? dayjs(project.createdAt).format('D MMMM YYYY')
      : undefined;

    const editedAt = project.editedAt ? (
      <div className={cn('EditedAt')}>
        <Text size="s">{dayjs(project.editedAt).format('D MMMM YYYY')}</Text>
        <Text size="s" view="secondary">
          {dayjs(project.editedAt).format(', H:mm')}
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
  const projects =
    props.data?.projects?.__typename !== 'ProjectList'
      ? []
      : projectsMapper(props.data?.projects.data);

  const isLoading = props.loading && !props.data;

  const table = (
    <div className={cn('Table')}>
      <ProjectsTable
        rows={projects}
        onFavorite={(id) => {
          // eslint-disable-next-line no-console
          console.log(id);
        }}
      />
      <div className={cn('LoadMore')}>
        <Button view="ghost" width="full" label="Загрузить ещё" />
      </div>
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
            <Button label="Создать проект" />
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
    </div>
  );
};
