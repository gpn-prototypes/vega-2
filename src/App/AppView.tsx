import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Root as VegaRoot } from '@gpn-prototypes/vega-ui';

import { PageLayout } from '../layouts/PageLayout';
import { CreateProjectPage, EditProjectPage } from '../pages/project';
import { ProjectsPage } from '../pages/projects';

import './App.css';

export const AppView = (): React.ReactElement => {
  return (
    <Route
      exact
      path={['/projects', '/projects/create', '/projects/show/:projectId']}
      render={() => (
        <VegaRoot className="SP-App-Wrapper" defaultTheme="dark">
          <div aria-label="Расчётная платформа" className="SP-App">
            <PageLayout>
              <Switch>
                <Route exact path="/projects" component={ProjectsPage} />
                <Route exact path="/projects/create" component={CreateProjectPage} />
                <Route exact path="/projects/show/:projectId" component={EditProjectPage} />
              </Switch>
            </PageLayout>
          </div>
        </VegaRoot>
      )}
    />
  );
};
