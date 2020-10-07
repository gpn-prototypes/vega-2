import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Root } from '@gpn-prototypes/vega-ui';

import { PageLayout } from './layouts/PageLayout';
import { CreateProjectPage } from './pages/create-project';
import { ProjectsPage } from './pages/projects';

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
      <div className="App">
        {/* {isAuthorized === undefined || isFetching ? (
          <Loader className="App__Loader" data-testid={testId.loader} />
        ) : ( */}
        {content}
        {/* )} */}
      </div>
    </Root>
  );
};
