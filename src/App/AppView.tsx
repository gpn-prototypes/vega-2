import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Root as VegaRoot } from '@gpn-prototypes/vega-ui';

import { PageLayout } from '../layouts/PageLayout';
import { CreateProjectPage, EditProjectPage } from '../pages/project';
import { ProjectsPage } from '../pages/projects';

import './App.css';

export const AppView = (): React.ReactElement => {
  return (
    <Router>
      <Route
        exact
        path={['/projects', '/projects/create', '/projects/show/:project_id']}
        render={() => (
          <VegaRoot className="App__Wrapper" defaultTheme="dark">
            <div className="App">
              <PageLayout>
                <Switch>
                  <Route exact path="/projects" component={ProjectsPage} />
                  <Route exact path="/projects/create" component={CreateProjectPage} />
                  <Route exact path="/projects/show/:project_id" component={EditProjectPage} />
                </Switch>
              </PageLayout>
            </div>
          </VegaRoot>
        )}
      />
    </Router>
  );
};
