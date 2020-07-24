import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Loader, Root, useMount } from '@gpn-prototypes/vega-ui';

import { PageLayout } from './layouts/PageLayout';
import { AuthPage } from './pages/auth';
import { CreateProjectPage } from './pages/create-project';
import { ProjectsPage } from './pages/projects';
import { useAppContext } from './platform/app-context';
import { AuthGuard } from './platform/auth-guard';

import './App.css';

export const AppView = (): React.ReactElement => {
  const {
    authAPI: { authorized, getCurrentUser },
  } = useAppContext();

  useMount(() => {
    getCurrentUser();
  });

  const content = (
    <Router>
      <Switch>
        <Route exact path="/auth">
          <AuthPage />
        </Route>
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
        <Route path="/about">
          <PageLayout>
            <div style={{ color: '#fff' }}>About</div>
          </PageLayout>
        </Route>
        <Route path="*">
          <PageLayout>
            <div>404</div>
          </PageLayout>
        </Route>
      </Switch>
      <AuthGuard authRoute="/auth" routeAfterAuth="/projects" />
    </Router>
  );

  return (
    <Root defaultTheme="dark">
      <div className="App">{authorized === undefined ? <Loader /> : content}</div>
    </Root>
  );
};
