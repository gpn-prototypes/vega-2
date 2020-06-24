import React from 'react';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { Layout } from './components/Layout';
import { AuthPage } from './pages/auth';

import './App.css';

export const App = (): React.ReactElement => (
  <Theme className="App" preset={presetGpnDark}>
    <Layout>{/* insert your code here */}</Layout>
    <AuthPage />
  </Theme>
);
