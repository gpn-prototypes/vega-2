import React from 'react';
import { Link } from 'react-router-dom';
import { Header as VegaHeader, Text } from '@gpn-prototypes/vega-ui';

type HeaderProps = {
  onLogout(): void;
};

const navItems = [
  {
    name: 'Пайплайн',
    isActive: true,
  },
  {
    name: 'Ресурсная база',
  },
  {
    name: 'Геологические риски',
  },
  {
    name: 'Профиль добычи',
  },
  {
    name: 'Оценка обустройства',
  },
  {
    name: 'Экономика проекта',
  },
  {
    name: 'Логика проекта',
  },
  {
    name: 'Моделирование',
  },
];

const menuItems = [
  { name: 'Проекты', url: '' },
  { name: 'Обучение', url: '' },
  { name: 'Помощь', url: '' },
];

// TODO: Доделать хедер, когда появится окончательный дизайн
export const Header: React.FC<HeaderProps> = (props) => {
  const { onLogout } = props;

  const [activeItem, setActiveItem] = React.useState(navItems.filter((ni) => ni.isActive));

  const handleChangeActive = (item: typeof activeItem): void => {
    setActiveItem(item);
  };

  return (
    <VegaHeader>
      <VegaHeader.Menu title="Очень-очень длинное длинное название проекта">
        {menuItems.map((menuItem) => (
          <VegaHeader.Menu.Item key={menuItem.name}>
            {(menuItemProps): React.ReactNode => (
              <Link
                onClick={menuItemProps.closeMenu}
                className={menuItemProps.className}
                to={menuItem.url}
              >
                <Text>{menuItem.name}</Text>
              </Link>
            )}
          </VegaHeader.Menu.Item>
        ))}
        <VegaHeader.Menu.Delimiter />
        <VegaHeader.Menu.Item>
          {(menuItemProps): React.ReactNode => (
            <Link
              onClick={(e): void => {
                if (menuItemProps.closeMenu) {
                  menuItemProps.closeMenu(e);
                }
                onLogout();
              }}
              className={menuItemProps.className}
              to="/auth"
            >
              <Text>Выйти</Text>
            </Link>
          )}
        </VegaHeader.Menu.Item>
      </VegaHeader.Menu>
      <VegaHeader.Nav
        navItems={navItems}
        activeItem={activeItem}
        onChangeItem={handleChangeActive}
      />
    </VegaHeader>
  );
};
