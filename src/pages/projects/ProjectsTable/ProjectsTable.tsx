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
  name: `${blockName}__name`,
  nameWrap: `${blockName}__nameWrap`,
  iconFavorite: `${blockName}__iconFavorite`,
  columnName: `${blockName}__columnName`,
};

type Props = {
  rows?: TableRow[];
  placeholder?: string | React.ReactElement;
  onFavorite(id: string, payload: ProjectUpdateType): void;
};

const COLUMNS: React.ComponentProps<typeof Table>['columns'] = [
  {
    title: (
      <div className={styles.columnName}>
        <div className={styles.iconWrap}>
          <IconBookmarkStroked className={styles.iconFavorite} size="s" view="ghost" />
        </div>
        <>Название</>
      </div>
    ),
    accessor: 'name',
    // sortable: true,
    width: 260,
  },
  {
    title: 'Описание',
    accessor: 'description',
    // sortable: true,
    width: 260,
  },
  {
    title: 'Регион',
    accessor: 'region',
    // sortable: true,
    width: 260,
  },
  {
    title: 'Создан',
    accessor: 'createdAt',
    // sortable: true,
    width: 200,
  },
  // {
  //   title: 'Ваша роль',
  //   accessor: 'roles',
  //   // sortable: true,
  //   width: 185,
  // },
  {
    title: 'Автор',
    accessor: 'createdBy',
    // sortable: true,
    width: 260,
  },
  {
    title: 'Изменён',
    accessor: 'editedAt',
    // sortable: true,
    width: 216,
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
        name: (
          <div
            className={styles.nameWrap}
            title={project.name && project.name.length > 40 ? project.name : undefined}
          >
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
            <div className={styles.name}>{project.name}</div>
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
