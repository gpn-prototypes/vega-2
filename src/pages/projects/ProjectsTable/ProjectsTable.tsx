import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  IconBookmarkFilled,
  IconBookmarkStroked,
  Table,
  Text,
} from '@gpn-prototypes/vega-ui';

import { EditedAt } from './EditedAt';
import { TableRow } from './types';

import './ProjectsTable.css';

const blockName = 'ProjectsTable';
const styles = {
  iconWrap: `${blockName}__iconWrap`,
  textOverflow: `${blockName}__textOverflow`,
  nameWrap: `${blockName}__nameWrap`,
  iconFavorite: `${blockName}__iconFavorite`,
  columnName: `${blockName}__columnName`,
  favorite: `${blockName}__favorite`,
  favoriteActive: `${blockName}__favorite_active`,
};

const testId = {
  favoriteSelectedButton: 'ProjectsPage:button:favoriteSelectedButton',
  favoriteNotSelectedButton: 'ProjectsPage:button:favoriteNotSelectedButton',
  projectName: 'ProjectsPage:cell:name',
  placeholder: 'ProjectsPage:table:placeholder',
} as const;

export type ProjectsTableProps = {
  rows?: TableRow[];
  placeholder?: string | React.ReactElement;
  onFavorite(id: string, payload: { isFavorite: boolean; version: number }): void;
};

type ProjectsTableType = React.FC<ProjectsTableProps> & {
  testId: typeof testId;
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

export const ProjectsTable: ProjectsTableType = (props) => {
  const placeholder = props.placeholder ?? (
    <Text size="s" data-testid={testId.placeholder}>
      Пока нет ни одного проекта :(
    </Text>
  );
  const [idActiveRow, setIdActiveRow] = React.useState<string | undefined>(undefined);

  const history = useHistory();

  const handleShowMenu = (isMenuShowed: boolean, id: string): void => {
    if (isMenuShowed) {
      setIdActiveRow(id);
    } else {
      setIdActiveRow(undefined);
    }
  };

  const rows =
    props.rows?.map((project) => {
      const icon = project.isFavorite ? IconBookmarkFilled : IconBookmarkStroked;

      return {
        ...project,
        description: (
          <div
            title={
              project.description && project.description.length > 40
                ? project.description
                : undefined
            }
            className={styles.textOverflow}
          >
            {project?.description}
          </div>
        ),
        name: (
          <div
            className={styles.nameWrap}
            title={project.name && project.name.length > 40 ? project.name : undefined}
          >
            <div className={styles.iconWrap}>
              <Button
                label="Избранное"
                iconLeft={icon}
                iconSize="s"
                onlyIcon
                view="clear"
                size="xs"
                form="round"
                data-testid={
                  project.isFavorite
                    ? testId.favoriteSelectedButton
                    : testId.favoriteNotSelectedButton
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (project.id && project.status && project.version) {
                    props.onFavorite(project.id, {
                      version: project.version,
                      isFavorite: !project.isFavorite,
                    });
                  }
                }}
                className={`${styles.favorite} ${project.isFavorite ? styles.favoriteActive : ''}`}
              />
            </div>
            <div className={styles.textOverflow} data-testid={testId.projectName}>
              {project.name}
            </div>
          </div>
        ),
        editedAt: (
          <EditedAt
            date={project.editedAt}
            menu={project.menu}
            onMenuToggle={(isMenuShowed) => handleShowMenu(isMenuShowed, project.id)}
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
      activeRow={{
        id: idActiveRow,
        onChange: ({ id }) => {
          history.push(`/projects/show/${id}`);
        },
      }}
    />
  );
};

ProjectsTable.testId = testId;
