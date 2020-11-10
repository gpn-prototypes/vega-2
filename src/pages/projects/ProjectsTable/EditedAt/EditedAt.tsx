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
  onClickItem?: VoidFunction;
};

export const EditedAt: React.FC<EditedAtProps> = ({ date, menu, isVisible, onClickItem }) => {
  const anchorRef = React.createRef<HTMLButtonElement>();
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);
  return (
    <div className={styles.root}>
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
