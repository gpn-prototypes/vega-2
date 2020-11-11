import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Loader, Text } from '@gpn-prototypes/vega-ui';

import { ProjectUpdateType } from '../../__generated__/types';

import { TableRow } from './ProjectsTable/types';
import { cnProjectsPage as cn } from './cn-projects-page';
import { ProjectsTable } from './ProjectsTable';

import './ProjectsPage.css';

const testId = {
  root: 'ProjectsPage:root',
};

type Props = {
  projects: TableRow[];
  isLoading: boolean;
  onFavorite(id: string, payload: ProjectUpdateType): void;
};

export const ProjectsPageView: React.FC<Props> = (props) => {
  // TODO: Поправить условие, когда можно будет получить общее количество проектов и сделают пагинацию
  const visibleLoadMore = props.projects.length > 20;

  const table = (
    <div className={cn('Table')}>
      <ProjectsTable
        rows={props.projects}
        onFavorite={(id, payload) => {
          // eslint-disable-next-line no-console
          props.onFavorite(id, payload);
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

        {/* <ProjectsFilter
          // eslint-disable-next-line no-console
          onInputSearch={(value: string): void => console.log(`InputSearch: ${value}`)}
          // eslint-disable-next-line no-console
          onChangeFilter={(value: Item): void => console.log(`Filter: ${value.name}`)}
        /> */}

        {props.isLoading ? (
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
