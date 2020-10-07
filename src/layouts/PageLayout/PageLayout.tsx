import * as React from 'react';

import { cnLayout } from './cn-layout';

import './PageLayout.css';

type Props = {
  children?: React.ReactNode;
};

/* TODO: добавить привязку заголовка в меню к текущей странице */
/* Заголовок может отображать название открытого проекта */

export const PageLayout: React.FC<Props> = (props) => {
  return (
    <div className={cnLayout()}>
      <div className={cnLayout('Body')}>{props.children}</div>
    </div>
  );
};
