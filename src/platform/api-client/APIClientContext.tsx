import { createContext, useContext } from 'react';
import Cookie from 'universal-cookie';

import { APIClient } from './api-client';

export const APIClientContext = createContext<APIClient>(
  new APIClient(new Cookie(), { baseApiUrl: '' }),
);

export const useAPIClient = (): APIClient => useContext(APIClientContext);
