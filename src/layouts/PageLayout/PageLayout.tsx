import * as React from 'react';
import { useAppContext } from '@vega/platform/app-context';

import { Header } from '../Header';

import { cnLayout } from './cn-layout';

import './PageLayout.css';

type Props = {
  children?: React.ReactNode;
};

/* TODO: добавить привязку заголовка в меню к текущей странице */
/* Заголовок может отображать название открытого проекта */

const menuItems = [
  {
    name: 'Проекты',
    url: '/projects',
    onClick: () => {
      console.log('Проекты');
    },
  },
  { name: 'Обучение', url: '/lessons' },
  { name: 'Помощь', url: '/help' },
];

export const PageLayout: React.FC<Props> = (props) => {
  const { authAPI } = useAppContext();
  return (
    <div className={cnLayout()}>
      <Header onLogout={authAPI.logout} />
      <div className={cnLayout('Body')}>{props.children}</div>
    </div>
  );
};
