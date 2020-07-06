import React, { useState } from 'react';
import {
  Button,
  IconForward,
  NavigationList,
  PageBanner,
  PageFooter,
} from '@gpn-prototypes/vega-ui';

import { cnCreateProjectPage } from './cn-create-project-page';

import './CreateProjectPage.css';

type Props = {};

export const CreateProjectPage: React.FC<Props> = () => {
  const [activeItemValue, setActiveItemValue] = useState('1');

  const items = [
    { value: '1', title: 'Описание проекта' },
    { value: '2', title: 'Участники' },
    { value: '3', title: 'Связанные документы и файлы' },
  ];

  return (
    <div className={cnCreateProjectPage()}>
      <header className={cnCreateProjectPage('Header')}>
        III Создание проекта (заменить на компонент из vega-ui)
      </header>
      <div className={cnCreateProjectPage('Main')}>
        <PageBanner title="Усть-Енисей" description="Россия, Ямало-Ненецкий АО, Усть-Енисей" />
        <div className={cnCreateProjectPage('Wrapper')}>
          <div className={cnCreateProjectPage('Content')}>
            <NavigationList className={cnCreateProjectPage('NavigationList')} ordered>
              {items.map(({ value, title }) => (
                <NavigationList.Item key={value} active={value === activeItemValue}>
                  {(props): React.ReactNode => (
                    <button
                      type="button"
                      onClick={(): void => setActiveItemValue(value)}
                      {...props}
                    >
                      {title}
                    </button>
                  )}
                </NavigationList.Item>
              ))}
            </NavigationList>
            <div className={cnCreateProjectPage('Form')}>
              Форма (заменить на компонент из vega-ui)
            </div>
          </div>
          <PageFooter className={cnCreateProjectPage('Footer')}>
            <Button size="s" view="ghost" label="Отмена" />
            <Button size="s" view="primary" label="Далее" iconRight={IconForward} />
          </PageFooter>
        </div>
      </div>
    </div>
  );
};
