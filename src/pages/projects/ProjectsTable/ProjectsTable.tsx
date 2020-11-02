import React from 'react';
import {
  Button,
  IconBookmarkFilled,
  IconBookmarkStroked,
  Table,
  Text,
} from '@gpn-prototypes/vega-ui';

import './ProjectsTable.css';

const blockName = 'ProjectsTable';
const styles = {
  editedAt: `${blockName}__editedAt`,
  editedTime: `${blockName}__editedTime`,
};

export type ProjectsTableRow = {
  id: string;
  isFavorite?: boolean;
  name?: string;
  region?: string;
  roles?: string;
  createdBy?: string;
  createdAt?: string;
  editedAt?: string | React.ReactElement;
};

type Props = {
  rows?: ProjectsTableRow[];
  placeholder?: string | React.ReactElement;
  onFavorite: (id: string) => void;
};

const COLUMNS: React.ComponentProps<typeof Table>['columns'] = [
  {
    title: <IconBookmarkStroked size="s" view="ghost" />,
    accessor: 'favorite',
    align: 'center',
    width: 55,
  },
  {
    title: 'Название',
    accessor: 'name',
    sortable: true,
    width: 195,
  },
  {
    title: 'Регион',
    accessor: 'region',
    sortable: true,
    width: 245,
  },
  {
    title: 'Ваша роль',
    accessor: 'roles',
    sortable: true,
    width: 185,
  },
  {
    title: 'Автор',
    accessor: 'createdBy',
    sortable: true,
    width: 215,
  },
  {
    title: 'Создан',
    accessor: 'createdAt',
    sortable: true,
    width: 165,
  },
  {
    title: 'Изменён',
    accessor: 'editedAt',
    sortable: true,
    width: 212,
  },
];

export const ProjectsTable: React.FC<Props> = (props) => {
  const placeholder = props.placeholder ?? <Text size="s">Пока нет ни одного проекта :(</Text>;

  const rows =
    props.rows?.map((project) => {
      const editedAt = (
        <div className={styles.editedAt}>
          <Text size="s" className={styles.editedTime}>
            {project.editedAt}
          </Text>
        </div>
      );
      const icon = project.isFavorite ? IconBookmarkFilled : IconBookmarkStroked;

      return {
        ...project,
        favorite: (
          <Button
            label="Избранное"
            iconLeft={icon}
            iconSize="s"
            onlyIcon
            view="clear"
            size="xs"
            form="round"
            onClick={() => {
              if (project.id) {
                props.onFavorite(project.id);
              }
            }}
          />
        ),
        editedAt,
      };
    }) || [];

  return (
    <Table
      isZebraStriped
      columns={COLUMNS}
      rows={rows}
      verticalAlign="center"
      emptyRowsPlaceholder={placeholder}
    />
  );
};
