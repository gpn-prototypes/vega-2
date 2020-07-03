import React from 'react';
import { Button } from '@gpn-prototypes/vega-button';
import { IconForward } from '@gpn-prototypes/vega-icons';
import { NavigationList } from '@gpn-prototypes/vega-navigation-list';
import { PageBanner } from '@gpn-prototypes/vega-page-banner';
import { PageFooter } from '@gpn-prototypes/vega-page-footer';

import { cnCreateProjectPage } from './cn-create-project-page';

import './CreateProjectPage.css';

type Props = {};

export const CreateProjectPage: React.FC<Props> = () => {
  const active = true;

  return (
    <div className={cnCreateProjectPage()}>
      <header className={cnCreateProjectPage('Header')}>
        III Создание проекта (заменить на компонент из vega-ui)
      </header>
      <main className={cnCreateProjectPage('Main')}>
        <PageBanner />
        <div className={cnCreateProjectPage('Wrapper')}>
          <div className={cnCreateProjectPage('Content')}>
            <NavigationList className={cnCreateProjectPage('NavigationList')} ordered>
              <NavigationList.Item active={active}>
                {(props): React.ReactNode => (
                  <button type="button" {...props}>
                    Описание проекта
                  </button>
                )}
              </NavigationList.Item>
              <NavigationList.Item>
                {(props): React.ReactNode => (
                  <button type="button" {...props}>
                    Участники
                  </button>
                )}
              </NavigationList.Item>
              <NavigationList.Item>
                {(props): React.ReactNode => (
                  <button type="button" {...props}>
                    Связанные документы и файлы
                  </button>
                )}
              </NavigationList.Item>
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
      </main>
    </div>
  );
};
