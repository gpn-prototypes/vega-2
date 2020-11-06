import React from 'react';
import {
  Button,
  IconBookmarkFilled,
  IconBookmarkStroked,
  IconKebab,
  NavigationList,
  Popover,
  Table,
  Text,
} from '@gpn-prototypes/vega-ui';

import './ProjectsTable.css';

const blockName = 'ProjectsTable';
const styles = {
  editedAt: `${blockName}__editedAt`,
  editedTime: `${blockName}__editedTime`,
  menu: `${blockName}__menu`,
  navigation: `${blockName}__navigation`,
  navigationItem: `${blockName}__navigationItem`,
  iconWrap: `${blockName}__iconWrap`,
};

export type MenuItemProps = {
  close: VoidFunction;
  className?: string;
};

type MenuItem = {
  key: string;
  Element: React.FC<MenuItemProps>;
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
  menu?: MenuItem[];
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

type EditedAtProps = {
  date?: string | React.ReactElement;
  menu?: MenuItem[];
  isVisible: boolean;
  onClickItem?: VoidFunction;
};

const EditedAt: React.FC<EditedAtProps> = ({ date, menu, isVisible, onClickItem }) => {
  const anchorRef = React.createRef<HTMLButtonElement>();
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);
  return (
    <div className={styles.editedAt}>
      <Text size="s" className={styles.editedTime}>
        {date}
      </Text>
      <div className={styles.menu}>
        <div className={styles.iconWrap}>
          {isVisible && (
            <Button
              label="Меню"
              iconLeft={IconKebab}
              iconSize="s"
              onlyIcon
              view="clear"
              size="xs"
              ref={anchorRef}
              onClick={() => setIsPopoverVisible(!isPopoverVisible)}
            />
          )}
        </div>

        {menu && isPopoverVisible && (
          <Popover
            direction="downLeft"
            offset={6}
            anchorRef={anchorRef}
            onClickOutside={() => setIsPopoverVisible(false)}
          >
            <NavigationList className={styles.navigation}>
              {menu.map(({ Element, key }) => {
                return (
                  <NavigationList.Item key={key}>
                    {({ className }) => {
                      return (
                        <Element
                          close={() => {
                            setIsPopoverVisible(false);
                            if (onClickItem) {
                              onClickItem();
                            }
                          }}
                          className={`${className} ${styles.navigationItem}`}
                        />
                      );
                    }}
                  </NavigationList.Item>
                );
              })}
            </NavigationList>
          </Popover>
        )}
      </div>
    </div>
  );
};

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
                  if (project.id) {
                    props.onFavorite(project.id);
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
