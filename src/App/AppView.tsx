import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Root as VegaRoot } from '@gpn-prototypes/vega-ui';

import { PageLayout } from '../layouts/PageLayout';
import { CreateProjectPage } from '../pages/create-project';
import { ProjectsPage } from '../pages/projects';

import './App.css';

export const AppView = (): React.ReactElement => {
  const content = (
    <Router>
      <Switch>
        <Route exact path="/projects">
          <PageLayout>
            <ProjectsPage />
          </PageLayout>
        </Route>
        <Route exact path="/projects/create">
          <PageLayout>
            <CreateProjectPage />
          </PageLayout>
        </Route>
        <Route exact path="/">
          <PageLayout>{/* insert your code here */}</PageLayout>
        </Route>
        <Route path="*">
          <PageLayout>
            <div>404</div>
          </PageLayout>
        </Route>
      </Switch>
    </Router>
  );

  return (
    <VegaRoot className="App__Wrapper" defaultTheme="dark">
      <div className="App">{content}</div>
    </VegaRoot>
  );
};
