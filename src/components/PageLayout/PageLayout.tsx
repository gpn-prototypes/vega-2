import * as React from 'react';

import { cnLayout } from './cn-layout';

import './PageLayout.css';

type Props = {
  children?: React.ReactNode;
};

export const PageLayout: React.FC<Props> = (props) => {
  return (
    <div className={cnLayout()}>
      <div className={cnLayout('Header')}>Header vega-ui</div>
      <div className={cnLayout('Body')}>{props.children}</div>
    </div>
  );
};
