import React from 'react';
import {
  Button,
  IconBookmarkFilled,
  IconBookmarkStroked,
  Table,
  Text,
} from '@gpn-prototypes/vega-ui';

import { ProjectUpdateType } from '../../../__generated__/types';

import { EditedAt } from './EditedAt';
import { TableRow } from './types';

import './ProjectsTable.css';

const blockName = 'ProjectsTable';
const styles = {
  iconWrap: `${blockName}__iconWrap`,
};

type Props = {
  rows?: TableRow[];
  placeholder?: string | React.ReactElement;
  onFavorite(id: string, payload: ProjectUpdateType): void;
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
    // sortable: true,
    width: 195,
  },
  {
    title: 'Регион',
    accessor: 'region',
    // sortable: true,
    width: 245,
  },
  {
    title: 'Ваша роль',
    accessor: 'roles',
    // sortable: true,
    width: 185,
  },
  {
    title: 'Автор',
    accessor: 'createdBy',
    // sortable: true,
    width: 215,
  },
  {
    title: 'Создан',
    accessor: 'createdAt',
    // sortable: true,
    width: 165,
  },
  {
    title: 'Изменён',
    accessor: 'editedAt',
    // sortable: true,
    width: 212,
  },
];

export const ProjectsTable: React.FC<Props> = (props) => {
  const placeholder = props.placeholder ?? <Text size="s">Пока нет ни одного проекта :(</Text>;
  const [idMenuVisible, setIdMenuVisible] = React.useState<string | undefined>(undefined);

  const rows =
    props.rows?.map((project) => {
      const icon = project.isFavorite ? IconBookmarkFilled : IconBookmarkStroked;
      const isVisible = idMenuVisible === project.id;

      return {
        ...project,
        favorite: (
          <div className={styles.iconWrap}>
            {(isVisible || project.isFavorite) && (
              <Button
                label="Избранное"
                iconLeft={icon}
                iconSize="s"
                onlyIcon
                view="clear"
                size="xs"
                form="round"
                onClick={() => {
                  if (project.id && project.status && project.version) {
                    props.onFavorite(project.id, {
                      status: project.status,
                      version: project.version,
                      isFavorite: !project.isFavorite,
                    });
                  }
                }}
              />
            )}
          </div>
        ),
        editedAt: (
          <EditedAt
            date={project.editedAt}
            menu={project.menu}
            isVisible={isVisible}
            onClickItem={() => setIdMenuVisible(undefined)}
          />
        ),
      };
    }) || [];

  return (
    <Table
      zebraStriped="odd"
      columns={COLUMNS}
      rows={rows}
      verticalAlign="center"
      emptyRowsPlaceholder={placeholder}
      onRowHover={({ id }) => {
        setIdMenuVisible(id);
      }}
    />
  );
};
