import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Root } from '@gpn-prototypes/vega-ui';
import { PageLayout } from '@vega/layouts/PageLayout';
import { CreateProjectPage } from '@vega/pages/create-project';
import { ProjectsPage } from '@vega/pages/projects';

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
    <Root defaultTheme="dark">
      <div className="App">{content}</div>
    </Root>
  );
};
