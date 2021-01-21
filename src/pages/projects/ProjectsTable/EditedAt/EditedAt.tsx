import React from 'react';
import { Button, IconKebab, NavigationList, Popover, Text } from '@gpn-prototypes/vega-ui';

import { DateEditedAt, MenuItem } from '../types';

import { cnEditedAt } from './cn-edited-at';

export type EditedAtProps = {
  date?: DateEditedAt;
  menu?: MenuItem[];
  onMenuToggle(isMenuShowed: boolean): void;
};

const testId = {
  menuList: 'ProjectsPage:menu',
  buttonMenu: 'ProjectsPage:button:menu.trigger',
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
      <Text size="s" className={cnEditedAt('editedTime').toString()} data-testid={testId.dateEdit}>
        {date && (
          <>
            <Text size="s">{date.date}</Text>
            <Text size="s" view="secondary">
              {date.time}
            </Text>
          </>
        )}
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
              /* istanbul ignore else */
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
                          data-testid={`${testId.menuList}:${key}`}
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
