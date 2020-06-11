import * as React from 'react';

import { cnLayout } from './cn-layout';

import './Layout.css';

type Props = {
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = (props) => {
  return (
    <div className={cnLayout()}>
      <div className={cnLayout('Header')}>Header vega-ui</div>
      <div className={cnLayout('Body')}>{props.children}</div>
      <div className={cnLayout('Footer')}>Footer vega-ui</div>
    </div>
  );
};
