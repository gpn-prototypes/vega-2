import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { PageLayout } from './components/PageLayout';
import { AuthPage } from './pages/auth';

import './App.css';

export const App = (): React.ReactElement => (
  <Theme className="App" preset={presetGpnDark}>
    <Router>
      <Switch>
        <Route exact path="/auth">
          <AuthPage />
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
    </Router>
  </Theme>
);
