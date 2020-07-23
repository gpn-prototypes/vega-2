import React from 'react';
import { CookiesContext } from '@vega/platform/cookies';
import { HTTPClient, HTTPClientContext } from '@vega/platform/http-client';
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

const httpClient = new HTTPClient(cookies, { baseApiUrl, apiPath, useApiProxy });

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const { children } = props;

  return (
    <CookiesContext.Provider value={cookies}>
      <HTTPClientContext.Provider value={httpClient}>
        <AppStoreProvider>{children}</AppStoreProvider>
      </HTTPClientContext.Provider>
    </CookiesContext.Provider>
  );
};
