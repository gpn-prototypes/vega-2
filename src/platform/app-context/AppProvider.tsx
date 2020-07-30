import React from 'react';
import { APIClient, APIClientContext } from '@vega/platform/api-client';
import { CookiesContext } from '@vega/platform/cookies';
import Cookie from 'universal-cookie';

import { AppConfig } from '../../../app-config';

import { AppStoreProvider } from './AppStoreProvider';

const cookies = new Cookie();

declare global {
  interface Window {
    appConfig: AppConfig;
  }
}

const { baseApiUrl, apiPath, useApiProxy } = window.appConfig;

const apiClient = new APIClient(cookies, { baseApiUrl, apiPath, useApiProxy });

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const { children } = props;

  return (
    <CookiesContext.Provider value={cookies}>
      <APIClientContext.Provider value={apiClient}>
        <AppStoreProvider>{children}</AppStoreProvider>
      </APIClientContext.Provider>
    </CookiesContext.Provider>
  );
};
