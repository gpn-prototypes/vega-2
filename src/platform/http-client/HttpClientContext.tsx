import { createContext, useContext } from 'react';
import Cookie from 'universal-cookie';

import { HTTPClient } from './http-client';

const { baseApiUrl, useApiProxy, apiPath } = window.appConfig;

export const HTTPClientContext = createContext<HTTPClient>(
  new HTTPClient(new Cookie(), { baseApiUrl, useApiProxy, apiPath }),
);

export const useHttpClient = (): HTTPClient => useContext(HTTPClientContext);
