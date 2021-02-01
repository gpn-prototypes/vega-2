import React from 'react';
import { Button, IconKebab, NavigationList, Popover, Text } from '@gpn-prototypes/vega-ui';

import { MenuItem } from '../types';

import { cnEditedAt } from './cn-edited-at';

type EditedAtProps = {
  date?: string | React.ReactElement;
  menu?: MenuItem[];
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

export const EditedAt: EditedAtType = ({ date, menu, onMenuToggle }) => {
  const anchorRef = React.createRef<HTMLButtonElement>();
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);

  const showPopover = (needShow: boolean) => {
    onMenuToggle(needShow);
    setIsPopoverVisible(needShow);
  };

  return (
    <div className={cnEditedAt('root')}>
      <Text size="s" className={cnEditedAt('editedTime')} data-testid={testId.dateEdit}>
        {date}
      </Text>
      <div className={cnEditedAt('menu')}>
        <div className={cnEditedAt('iconWrap')}>
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
            className={cnEditedAt('iconButton').toString()}
          />
        </div>

        {menu && isPopoverVisible && (
          <Popover
            direction="downLeft"
            offset={6}
            anchorRef={anchorRef}
            onClickOutside={() => {
              if (isPopoverVisible) {
                showPopover(false);
              }
            }}
          >
            <NavigationList className={cnEditedAt('navigation')} data-testid={testId.menuList}>
              {menu.map(({ Element, key }) => {
                return (
                  <NavigationList.Item key={key}>
                    {({ className }) => {
                      return (
                        <Element
                          close={() => {
                            showPopover(false);
                          }}
                          className={cnEditedAt('navigationItem').mix([className])}
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
