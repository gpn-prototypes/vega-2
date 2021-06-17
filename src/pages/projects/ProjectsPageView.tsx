/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, IconSearch, Loader, Text, TextField } from '@gpn-prototypes/vega-ui';

import { SortData, TableRow } from './ProjectsTable/types';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ProjectsTable } from './ProjectsTable';

import './ProjectsPage.css';

const testId = {
  root: 'ProjectsPage:root',
  rootTitle: 'ProjectsPage:root:title',
  create: 'ProjectsPage:link:create',
  table: 'ProjectsPage:table',
  loader: 'ProjectsPage:loader',
};

export type ProjectsPageViewProps = {
  projects: TableRow[];
  isLoading: boolean;
  isLoadingMore: boolean;
  counterProjects: { current?: number; total?: number };
  onLoadMore: VoidFunction;
  onFavorite(id: string, payload: { isFavorite: boolean; version: number }): void;
  onSort(sortedOptions: SortData | null): void;
  searchString: string | null;
  setSearchString(searchString: string | null): void;
};

type ProjectsPageViewType = React.FC<ProjectsPageViewProps> & {
  testId: typeof testId;
};

export const ProjectsPageView: ProjectsPageViewType = (props) => {
  const { current, total } = props.counterProjects;

  const [projects, setProjects] = React.useState(props.projects);
  const [warning, setWarning] = React.useState('');

  const [visibleLoadMore, setVisibleLoadMore] = React.useState(false);

  React.useEffect(() => {
    setProjects(props.projects);
    setVisibleLoadMore(current !== undefined && total !== undefined ? current < total : false);
  }, [props.projects, current, total]);

  function handleSearch(search: string) {
    props.setSearchString(search);
    if (!search || (search.length < 3 && search.length > 0)) {
      setWarning('Введите хотя бы 3 символа для поиска');
    } else {
      setWarning('');
    }
  }

  const table = (
    <div className={cn('Table')} data-testid={testId.table}>
      <ProjectsTable
        rows={projects}
        onSort={props.onSort}
        onFavorite={(id, payload) => {
          props.onFavorite(id, payload);
        }}
      />
      {visibleLoadMore && (
        <div className={cn('LoadMore')}>
          <Button
            view="ghost"
            width="full"
            label="Загрузить ещё"
            size="l"
            loading={props.isLoadingMore}
            onClick={props.onLoadMore}
          />
        </div>
      )}
    </div>
  );

  return (
    <div data-testid={testId.root} className={cn()}>
      <div className={cn('Container')}>
        <div className={cn('Header')}>
          <div className={cn('Heading')}>
            <Text
              as="h1"
              size="3xl"
              weight="bold"
              className={cn('Title').toString()}
              data-testid={testId.rootTitle}
            >
              Проекты
            </Text>
            {current && total && (
              <Text as="span" size="s" view="secondary" className={cn('SearchResult').toString()}>
                {current} из {total}
              </Text>
            )}
          </div>
          <div className={cn('HeaderContent')}>
            <div className={cn('LinkWrapper')}>
              <Link to="/projects/create" data-testid={testId.create}>
                <Button label="Создать новый проект" size="s" />
              </Link>
            </div>
            <div className={cn('SearchWrapper')}>
              <TextField
                className={cn('Search')}
                leftSide={IconSearch}
                size="s"
                type="input"
                onChange={(e) => handleSearch(e.value as string)}
                onBlur={() => setWarning('')}
                state={warning ? 'warning' : undefined}
                value={props.searchString}
                placeholder="Введите название проекта или имя автора"
              />
              <div className={cn('WarningSearchWrapper')}>
                <Text view="warning" size="xs">
                  {warning}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* <ProjectsFilter
          // eslint-disable-next-line no-console
          onInputSearch={(value: string): void => console.log(`InputSearch: ${value}`)}
          // eslint-disable-next-line no-console
          onChangeFilter={(value: Item): void => console.log(`Filter: ${value.name}`)}
        /> */}

        {props.isLoading ? (
          <div className={cn('Loader')} data-testid={testId.loader}>
            <Loader />
          </div>
        ) : (
          table
        )}
      </div>
    </div>
  );
};

ProjectsPageView.testId = testId;
