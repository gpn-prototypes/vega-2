import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconProps } from '@gpn-design/uikit/Icon';
import { Button, ChoiceGroup, IconBookmarkFilled, Text, TextField } from '@gpn-prototypes/vega-ui';

import { cnProjectsPage as cn } from './cn-projects-page';

import './ProjectsPage.css';

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

export const ProjectsPage: React.FC = (props) => {
  return (
    <div data-testid={testId.root} className={cn()} {...props}>
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
          <div className={cn('Table')}>
            <Text as="span" size="m">
              Таблица
            </Text>
          </div>
          <div className={cn('LoadMore')}>
            <Button view="ghost" width="full" label="Загрузить ещё" />
          </div>
        </div>
      </div>
    </div>
  );
};
