import React from 'react';

import { App as AppProviderProps, AppProvider } from './app-context';
import { AppView } from './AppView';

import './App.css';

type AppProps = AppProviderProps;

export const App = (props: AppProps): React.ReactElement => {
  const { ...app } = props;

  return (
    <AppProvider {...app}>
      <AppView />
    </AppProvider>
  );
};
