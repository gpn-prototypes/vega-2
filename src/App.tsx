import React from 'react';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { PageLayout } from './components/PageLayout';
import { AuthPage } from './pages/auth';

import './App.css';

export const App = (): React.ReactElement => (
  <Theme className="App" preset={presetGpnDark}>
    <PageLayout>{/* insert your code here */}</PageLayout>
    <AuthPage />
  </Theme>
);
