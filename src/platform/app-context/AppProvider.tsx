import React from 'react';
import { useAuth } from '@vega/data/auth';
import { CookiesContext } from '@vega/platform/cookies';
import { HTTPClient, HTTPClientContext } from '@vega/platform/http-client';
import Cookie from 'universal-cookie';

import { AppConfig } from '../../../app-config';

import { AppContext } from './AppContext';

const cookies = new Cookie();

declare global {
  interface Window {
    appConfig: AppConfig;
  }
}

const { appConfig } = window;

const { baseApiUrl, apiPath, useApiProxy } = appConfig;

const httpClient = new HTTPClient(cookies, {
  baseApiUrl,
  apiPath,
  useApiProxy,
});

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const { children } = props;
  const authAPI = useAuth();

  return (
    <CookiesContext.Provider value={cookies}>
      <HTTPClientContext.Provider value={httpClient}>
        <AppContext.Provider value={{ authAPI }}>{children}</AppContext.Provider>
      </HTTPClientContext.Provider>
    </CookiesContext.Provider>
  );
};
