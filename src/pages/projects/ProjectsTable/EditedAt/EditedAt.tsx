import React from 'react';
import { Button, IconKebab, NavigationList, Popover, Text } from '@gpn-prototypes/vega-ui';

import { MenuItem } from '../types';

import './EditedAt.css';

const blockName = 'ProjectsTable-EditedAt';
const styles = {
  root: `${blockName}__root`,
  editedTime: `${blockName}__editedTime`,
  menu: `${blockName}__menu`,
  navigation: `${blockName}__navigation`,
  navigationItem: `${blockName}__navigationItem`,
  iconWrap: `${blockName}__iconWrap`,
};

type EditedAtProps = {
  date?: string | React.ReactElement;
  menu?: MenuItem[];
  isVisible: boolean;
  onMenuToggle(isMenuShowed: boolean): void;
};

const testId = {
  buttonMenu: 'ProjectsPage:button:menu.trigger',
  menuList: 'ProjectsPage:menu',
  dateEdit: 'ProjectsPage:text:edited',
} as const;

type EditedAtType = React.FC<EditedAtProps> & {
  testId: typeof testId;
};

export const EditedAt: EditedAtType = ({ date, menu, isVisible, onMenuToggle }) => {
  const anchorRef = React.createRef<HTMLButtonElement>();
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);

  const showPopover = (needShow: boolean) => {
    onMenuToggle(needShow);
    setIsPopoverVisible(needShow);
  };

  return (
    <div className={styles.root}>
      <Text size="s" className={styles.editedTime} data-testid={testId.dateEdit}>
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
              data-testid={testId.buttonMenu}
              onClick={(e) => {
                e.stopPropagation();
                showPopover(!isPopoverVisible);
              }}
            />
          )}
        </div>

        {menu && isPopoverVisible && (
          <Popover
            direction="downLeft"
            offset={6}
            anchorRef={anchorRef}
            onClickOutside={() => showPopover(false)}
          >
            <NavigationList className={styles.navigation} data-testid={testId.menuList}>
              {menu.map(({ Element, key }) => {
                return (
                  <NavigationList.Item key={key}>
                    {({ className }) => {
                      return (
                        <Element
                          close={() => {
                            showPopover(false);
                          }}
                          className={`${className} ${styles.navigationItem}`}
                          data-testid="ds"
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

EditedAt.testId = testId;
