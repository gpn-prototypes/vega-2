import * as React from 'react';
import {
  ChoiceGroup,
  IconBookmarkFilled,
  IconProps,
  IconSearch,
  TextField,
} from '@gpn-prototypes/vega-ui';

import { cnProjectsPage as cn } from '../cn-projects-page';

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

export const ProjectsFilter: React.FC<ProjectFilterType> = ({ onInputSearch, onChangeFilter }) => {
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
