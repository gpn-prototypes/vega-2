import * as React from 'react';
import { Link } from 'react-router-dom';
import { HttpLink } from '@apollo/client';
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
};

type ProjectsPageViewType = React.FC<ProjectsPageViewProps> & {
  testId: typeof testId;
};
const config = {
  baseApiUrl: process.env.BASE_API_URL || process.env.VEGA_API_PROXY,
};

export const getMainLink = (): HttpLink =>
  new HttpLink({
    uri: `${config.baseApiUrl}/graphql`,
    // headers,
    fetch,
  });

export const ProjectsPageView: ProjectsPageViewType = (props) => {
  const { current, total } = props.counterProjects;
  const visibleLoadMore = current !== undefined && total !== undefined ? current < total : false;
  const [PROJECTS, setProjects] = React.useState(props.projects);
  const [searchString, setSearchString] = React.useState('');

  // function authHeader(defaultToken: string | undefined) {
  //   const token = logicConstructorService.identity?.getToken() || defaultToken;

  //   return { Authorization: `Bearer ${token}` };
  // }
  //   const headers = {
  //     ...authHeader(config.authToken),
  //   };

  React.useEffect(() => {
    setProjects(props.projects);
  }, [props.projects]);

  const handleSearch = (event) => {
    // event.value
    setSearchString(event.value);
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    // dispatch()
    fetch(`${config.baseApiUrl}/ProjectsTableList`, {
      headers: {},
      method: 'POST',
      body: searchString,
    }).then((res) => res.json());
    // .then((data) => console.log(data));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

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
                onChange={handleSearch}
                value={searchString}
                placeholder="Введите название проекта или имя автора"
              />
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
