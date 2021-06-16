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

  const [PROJECTS, setProjects] = React.useState(props.projects);
  let warning;
  const [visibleLoadMore, setVisibleLoadMore] = React.useState(false);
  if (String(props.searchString).length < 3 && String(props.searchString).length > 0) {
    warning = 'Введите хотя бы 3 символа для поиска';
  }

  React.useEffect(() => {
    setProjects(props.projects);
    setVisibleLoadMore(!!(current && current >= 20));
  }, [props.projects, current]);

  // React.useEffect(() => {
  //   props.onSort(props.sortedOptions)
  // }, [props.project]);

  const table = (
    <div className={cn('Table')} data-testid={testId.table}>
      <ProjectsTable
        rows={PROJECTS}
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
          <div className={cn('RightBlock')}>
            <div className={cn('LinkBlock')}>
              <Link to="/projects/create" data-testid={testId.create}>
                <Button label="Создать новый проект" size="s" />
              </Link>
            </div>
            <div className={cn('TextFieldBlock')}>
              <TextField
                className={cn('TextField')}
                leftSide={IconSearch}
                size="s"
                type="input"
                onChange={(e) => props.setSearchString(e.value)}
                value={props.searchString}
                placeholder="Введите название проекта или имя автора"
              />
              <div className={cn('WarningSearch')}>{warning}</div>
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
// function setSearchString(value: any) {
//   throw new Error('Function not implemented.');
// }
