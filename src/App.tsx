import React from 'react';

import { AppProvider } from './platform/app-context';
import { AppView } from './AppView';

import './App.css';

export const App = (): React.ReactElement => {
  return (
    <AppProvider>
      <AppView />
    </AppProvider>
  );
};
